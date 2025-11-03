// bot/utils/voiceHelpers.js - Fonctions utilitaires pour les salons vocaux

const voiceChannelManager = require('../../features/voiceChannelManager');
const permissionManager = require('../../features/permissionManager');
const { createErrorEmbed } = require('./embedBuilder');

/**
 * Vérifie que l'utilisateur est dans un salon vocal
 */
function checkUserInVoice(interaction) {
  const channel = interaction.member?.voice?.channel;
  
  if (!channel) {
    return {
      error: createErrorEmbed('Tu dois être dans un salon vocal!'),
      channel: null
    };
  }
  
  return { error: null, channel };
}

/**
 * Vérifie que le salon est créé par le bot
 */
function checkTrackedChannel(channel) {
  if (!voiceChannelManager.isTrackedChannel(channel.id)) {
    return {
      error: createErrorEmbed("Ce n'est pas un salon créé par le bot!")
    };
  }
  
  return { error: null };
}

/**
 * Vérifie que l'utilisateur est propriétaire du salon
 */
function checkChannelOwner(channel, userId) {
  if (!permissionManager.isChannelOwner(channel.id, userId)) {
    return {
      error: createErrorEmbed("Tu n'es pas le propriétaire de ce salon.")
    };
  }
  
  return { error: null };
}

/**
 * Effectue toutes les vérifications pour les commandes vocales
 */
function checkVoiceCommand(interaction, requiresTracking = false) {
  // Vérifier que l'utilisateur est en vocal
  const { error: voiceError, channel } = checkUserInVoice(interaction);
  if (voiceError) {
    return { error: voiceError, channel: null };
  }
  
  // Vérifier que le salon est tracké (si nécessaire)
  if (requiresTracking) {
    const { error: trackError } = checkTrackedChannel(channel);
    if (trackError) {
      return { error: trackError, channel: null };
    }
  }
  
  // Vérifier que l'utilisateur est propriétaire
  const { error: ownerError } = checkChannelOwner(channel, interaction.user.id);
  if (ownerError) {
    return { error: ownerError, channel: null };
  }
  
  return { error: null, channel };
}

/**
 * Récupère un utilisateur depuis les options (utilisateur ou ID)
 */
async function getUserFromOptions(interaction) {
  const userOption = interaction.options.getUser('utilisateur');
  const idOption = interaction.options.getString('id');
  
  try {
    if (userOption) {
      return { error: null, user: userOption };
    } else if (idOption) {
      const user = await interaction.client.users.fetch(idOption);
      return { error: null, user };
    } else {
      return {
        error: createErrorEmbed('Tu dois spécifier un utilisateur ou un ID!'),
        user: null
      };
    }
  } catch (error) {
    return {
      error: createErrorEmbed('Utilisateur introuvable!'),
      user: null
    };
  }
}

/**
 * Vérifie qu'un utilisateur n'est pas soi-même
 */
function checkNotSelf(interaction, targetUser, errorMessage) {
  if (targetUser.id === interaction.user.id) {
    return {
      error: createErrorEmbed(errorMessage)
    };
  }
  
  return { error: null };
}

/**
 * Vérifie qu'un utilisateur est dans le salon vocal
 */
function checkUserInChannel(interaction, targetUser, channel) {
  const member = interaction.guild.members.cache.get(targetUser.id);
  
  if (!member?.voice?.channel || member.voice.channelId !== channel.id) {
    return {
      error: createErrorEmbed(`${targetUser.username} doit être dans le salon vocal!`),
      member: null
    };
  }
  
  return { error: null, member };
}

module.exports = {
  checkUserInVoice,
  checkTrackedChannel,
  checkChannelOwner,
  checkVoiceCommand,
  getUserFromOptions,
  checkNotSelf,
  checkUserInChannel,
};
