const { PermissionFlagsBits } = require('discord.js');
const { getManaged, persistManaged, removeManaged } = require('../../utils/voiceChannelManager');
const { canControlVoice } = require('../../utils/permission-utils');

function getManagedFromInteraction(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel) return { error: 'Vous devez être dans un salon vocal.' };
  const record = getManaged(interaction.guild.id, channel.id);
  if (!record) return { error: 'Ce salon n\'est pas géré par DarwinBot.' };
  if (!canControlVoice(interaction.member, record)) return { error: 'Vous n\'êtes pas autorisé à gérer ce salon.' };
  return { channel, record };
}

async function setLock(channel, record, locked) {
  await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
    Connect: locked ? false : true,
    ViewChannel: true,
    Speak: true,
  });
  record.isLocked = locked;
  persistManaged(channel.guild.id, channel.id, record);
}

async function allowUser(channel, record, userId, allow) {
  if (allow) {
    await channel.permissionOverwrites.edit(userId, {
      Connect: true,
      ViewChannel: true,
      Speak: true,
    });
    if (!record.whitelist.includes(userId)) record.whitelist.push(userId);
  } else {
    await channel.permissionOverwrites.delete(userId).catch(() => null);
    record.whitelist = record.whitelist.filter((id) => id !== userId);
  }
  persistManaged(channel.guild.id, channel.id, record);
}

async function disbandChannel(channel) {
  removeManaged(channel.guild.id, channel.id);
  await channel.delete('Disband demandé');
}

module.exports = { getManagedFromInteraction, setLock, allowUser, disbandChannel, PermissionFlagsBits };
