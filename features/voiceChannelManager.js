// features/voiceChannelManager.js
// Gestionnaire des salons vocaux créés

const trackedChannels = new Map();

module.exports = {
  // Enregistrer un nouveau salon créé par le bot
  registerChannel: (channelId, ownerId, guildId) => {
    trackedChannels.set(channelId, {
      ownerId,
      guildId,
      isPrivate: false,
      isLocked: false,
      whitelist: [ownerId],
      createdAt: new Date(),
    });
    console.log(`📝 Salon enregistré: ${channelId}`);
  },

  // Désinscrire un salon
  unregisterChannel: (channelId) => {
    trackedChannels.delete(channelId);
    console.log(`🗑️ Salon désenregistré: ${channelId}`);
  },

  // Vérifier si un salon est suivi
  isTrackedChannel: (channelId) => {
    return trackedChannels.has(channelId);
  },

  // Obtenir les infos d'un salon
  getChannelData: (channelId) => {
    return trackedChannels.get(channelId);
  },

  // Mettre à jour les infos d'un salon
  updateChannelData: (channelId, data) => {
    const channel = trackedChannels.get(channelId);
    if (channel) {
      Object.assign(channel, data);
    }
  },

  // Obtenir tous les salons
  getAllChannels: () => {
    return trackedChannels;
  },

  // Obtenir le nombre de salons suivi
  getChannelCount: () => {
    return trackedChannels.size;
  },
};