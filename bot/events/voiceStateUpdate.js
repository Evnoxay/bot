// bot/events/voiceStateUpdate.js - DYNAMIQUE POUR /SETUP
const config = require('../config');
const fs = require('fs');
const path = require('path');
const voiceChannelManager = require('../../features/voiceChannelManager');
const { ChannelType, PermissionFlagsBits } = require('discord.js');

// Fonction pour lire le salon créateur dynamique
function getCreatorChannelId(guildId) {
  try {
    const file = fs.readFileSync(path.join(__dirname, '../data/serverConfig.json'), 'utf8');
    const conf = JSON.parse(file);
    return conf[guildId]?.creatorChannelId || config.creatorVoiceChannelId;
  } catch {
    return config.creatorVoiceChannelId;
  }
}

module.exports = {
  name: 'voiceStateUpdate',
  execute: async (oldState, newState) => {
    try {
      // Variables de guild/user
      if (!newState.member || !newState.guild) return;

      const member = newState.member;
      const guild = newState.guild;
      const displayName = member.displayName || member.user.username;
      const creatorId = getCreatorChannelId(guild.id);

      // Création d'un nouveau salon vocal
      if (
        !oldState.channelId &&
        newState.channelId &&
        newState.channelId === creatorId
      ) {
        try {
          const category = guild.channels.cache.get(config.categoryId);
          if (!category) return;

          const newChannel = await guild.channels.create({
            name: `🎤 ${displayName}`,
            type: ChannelType.GuildVoice,
            parent: config.categoryId,
            bitrate: 64000,
            permissionOverwrites: [
              { id: guild.id, allow: [PermissionFlagsBits.Connect] },
              { id: member.id, allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
            ],
          });

          voiceChannelManager.registerChannel(newChannel.id, member.id, guild.id);
          await newState.setChannel(newChannel);
        } catch (error) {
          console.error('Erreur création:', error);
        }
      }

      // Utilisateur quitte un salon
      if (oldState.channelId && !newState.channelId) {
        if (oldState.channelId === creatorId) return;

        const channel = oldState.guild.channels.cache.get(oldState.channelId);
        if (!channel) return;

        const isTracked = voiceChannelManager.isTrackedChannel(oldState.channelId);
        if (!isTracked) return;

        const data = voiceChannelManager.getChannelData(oldState.channelId);

        // Si propriétaire quitte
        if (data.ownerId === oldState.member.id) {
          if (channel.members.size > 0) {
            const firstMember = channel.members.first();
            try {
              data.ownerId = firstMember.id;
              if (!data.whitelist.includes(firstMember.id)) data.whitelist.push(firstMember.id);
              voiceChannelManager.updateChannelData(oldState.channelId, data);

              await channel.permissionOverwrites.edit(firstMember.id, { Connect: true, Speak: true });

              try {
                await channel.send(`🎯 <@${firstMember.id}> est maintenant propriétaire du salon **${channel.name}**!`);
              } catch { }
            } catch (error) {
              console.error('Erreur autoclaim:', error);
            }
          } else {
            try {
              voiceChannelManager.unregisterChannel(oldState.channelId);
              await channel.delete();
            } catch (error) {
              console.error('Erreur suppression:', error);
            }
          }
        } else {
          if (channel.members.size === 0) {
            try {
              voiceChannelManager.unregisterChannel(oldState.channelId);
              await channel.delete();
            } catch (error) {
              console.error('Erreur suppression:', error);
            }
          }
        }
      }

      // Utilisateur change de salon
      if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        // Va vers le salon de création
        if (newState.channelId === creatorId) {
          const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);
          const oldChannelId = oldState.channelId;

          try {
            const category = guild.channels.cache.get(config.categoryId);
            if (!category) return;

            const newChannel = await guild.channels.create({
              name: `🎤 ${displayName}`,
              type: ChannelType.GuildVoice,
              parent: config.categoryId,
              bitrate: 64000,
              permissionOverwrites: [
                { id: guild.id, allow: [PermissionFlagsBits.Connect] },
                { id: member.id, allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] },
              ],
            });

            voiceChannelManager.registerChannel(newChannel.id, member.id, guild.id);
            await newState.setChannel(newChannel);

            if (oldChannel) {
              try {
                voiceChannelManager.unregisterChannel(oldChannelId);
                await oldChannel.delete();
              } catch (error) {
                console.error('Erreur suppression ancien:', error);
              }
            }
          } catch (error) {
            console.error('Erreur création/déplacement:', error);
          }
          return;
        }

        // Ancien salon est le salon de création
        if (oldState.channelId === creatorId) return;

        const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);
        if (!oldChannel) return;

        const isTracked = voiceChannelManager.isTrackedChannel(oldState.channelId);
        if (!isTracked) return;

        const data = voiceChannelManager.getChannelData(oldState.channelId);

        // Si propriétaire se déplace
        if (data.ownerId === oldState.member.id) {
          if (oldChannel.members.size > 0) {
            const firstMember = oldChannel.members.first();
            try {
              data.ownerId = firstMember.id;
              if (!data.whitelist.includes(firstMember.id)) data.whitelist.push(firstMember.id);
              voiceChannelManager.updateChannelData(oldState.channelId, data);

              await oldChannel.permissionOverwrites.edit(firstMember.id, { Connect: true, Speak: true });

              try {
                await oldChannel.send(`🎯 <@${firstMember.id}> est maintenant propriétaire du salon **${oldChannel.name}**!`);
              } catch { }
            } catch (error) {
              console.error('Erreur autoclaim:', error);
            }
          } else {
            try {
              voiceChannelManager.unregisterChannel(oldState.channelId);
              await oldChannel.delete();
            } catch (error) {
              console.error('Erreur suppression:', error);
            }
          }
        } else {
          if (oldChannel.members.size === 0) {
            try {
              voiceChannelManager.unregisterChannel(oldState.channelId);
              await oldChannel.delete();
            } catch (error) {
              console.error('Erreur suppression:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur voiceStateUpdate:', error);
    }
  },
};