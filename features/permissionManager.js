// features/permissionManager.js
// Gestionnaire des permissions des salons vocaux
const voiceChannelManager = require('./voiceChannelManager');

module.exports = {
  // Vérifier si l'utilisateur est le propriétaire du salon
  isChannelOwner: (channelId, userId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    return data && data.ownerId === userId;
  },

  // Rendre le salon privé
  setPrivate: (channelId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data) {
      data.isPrivate = true;
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`🔒 Salon ${channelId} rendu privé`);
      return true;
    }
    return false;
  },

  // Rendre le salon public
  setPublic: (channelId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data) {
      data.isPrivate = false;
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`🔓 Salon ${channelId} rendu public`);
      return true;
    }
    return false;
  },

  // Ajouter un utilisateur à la liste blanche
  addUserToWhitelist: (channelId, userId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data && !data.whitelist.includes(userId)) {
      data.whitelist.push(userId);
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`✅ Utilisateur ${userId} ajouté à la liste blanche de ${channelId}`);
      return true;
    }
    return false;
  },

  // Retirer un utilisateur de la liste blanche
  removeUserFromWhitelist: (channelId, userId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data && data.whitelist.includes(userId)) {
      data.whitelist = data.whitelist.filter(id => id !== userId);
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`❌ Utilisateur ${userId} retiré de la liste blanche de ${channelId}`);
      return true;
    }
    return false;
  },

  // Verrouiller le salon
  lockChannel: (channelId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data) {
      data.isLocked = true;
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`🔐 Salon ${channelId} verrouillé`);
      return true;
    }
    return false;
  },

  // Déverrouiller le salon
  unlockChannel: (channelId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data) {
      data.isLocked = false;
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`🔓 Salon ${channelId} déverrouillé`);
      return true;
    }
    return false;
  },

  // Changer le propriétaire
  transferOwnership: (channelId, newOwnerId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    if (data) {
      const oldOwner = data.ownerId;
      data.ownerId = newOwnerId;
      if (!data.whitelist.includes(newOwnerId)) {
        data.whitelist.push(newOwnerId);
      }
      voiceChannelManager.updateChannelData(channelId, data);
      console.log(`👤 Propriété de ${channelId} transférée de ${oldOwner} à ${newOwnerId}`);
      return true;
    }
    return false;
  },

  // Vérifier si l'utilisateur est dans la liste blanche
  isUserWhitelisted: (channelId, userId) => {
    const data = voiceChannelManager.getChannelData(channelId);
    return data && data.whitelist.includes(userId);
  },

  // Obtenir les données de permission
  getPermissions: (channelId) => {
    return voiceChannelManager.getChannelData(channelId);
  },
};