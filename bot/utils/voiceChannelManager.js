const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { setGuildConfig, getGuildConfig } = require('./configManager');
const { firstMemberExcept } = require('./voiceHelpers');

function getManaged(guildId, channelId) {
  return getGuildConfig(guildId).managedChannels?.[channelId] || null;
}

function persistManaged(guildId, channelId, data) {
  setGuildConfig(guildId, (cfg) => {
    cfg.managedChannels = cfg.managedChannels || {};
    cfg.managedChannels[channelId] = data;
    return cfg;
  });
}

function removeManaged(guildId, channelId) {
  setGuildConfig(guildId, (cfg) => {
    cfg.managedChannels = cfg.managedChannels || {};
    delete cfg.managedChannels[channelId];
    return cfg;
  });
}

async function createTemporaryChannel(member, creatorChannelId, categoryId) {
  const guild = member.guild;
  if (member.voice.channelId !== creatorChannelId) return null;

  const channel = await guild.channels.create({
    name: `🎤 ${member.displayName}`,
    type: ChannelType.GuildVoice,
    parent: categoryId,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Speak],
      },
      {
        id: member.id,
        allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers],
      },
    ],
  });

  await member.voice.setChannel(channel);
  persistManaged(guild.id, channel.id, {
    ownerId: member.id,
    guildId: guild.id,
    whitelist: [],
    isLocked: false,
  });
  return channel;
}

async function cleanupOrTransfer(oldState) {
  const channel = oldState.channel;
  if (!channel) return;
  const managed = getManaged(channel.guild.id, channel.id);
  if (!managed) return;

  if (channel.members.size === 0) {
    removeManaged(channel.guild.id, channel.id);
    await channel.delete('Salon temporaire vide');
    return;
  }

  if (!channel.members.has(managed.ownerId)) {
    const newOwner = firstMemberExcept(channel, managed.ownerId) || channel.members.first();
    if (newOwner) {
      managed.ownerId = newOwner.id;
      persistManaged(channel.guild.id, channel.id, managed);
    }
  }
}

module.exports = {
  getManaged,
  persistManaged,
  removeManaged,
  createTemporaryChannel,
  cleanupOrTransfer,
};
