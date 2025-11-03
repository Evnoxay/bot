// features/commandHandler.js
// Gestionnaire de commandes - Charge les commandes depuis vocal.js

const vocal = require('../bot/commands/vocal');

module.exports = {
  // Charger toutes les commandes disponibles
  loadCommands: () => {
    const commands = [];

    commands.push(vocal.kickCommand);
    commands.push(vocal.privateCommand);
    commands.push(vocal.publicCommand);
    commands.push(vocal.renameCommand);
    commands.push(vocal.adduserCommand);
    commands.push(vocal.removeuserCommand);
    commands.push(vocal.lockCommand);
    commands.push(vocal.unlockCommand);
    commands.push(vocal.claimCommand);
    commands.push(vocal.transferCommand);
    commands.push(vocal.disbandCommand);

    console.log(`📦 ${commands.length} commandes chargées`);
    return commands;
  },

  // Obtenir une commande spécifique
  getCommand: (commandName) => {
    const commands = module.exports.loadCommands();
    return commands.find(cmd => cmd.data.name === commandName);
  },

  // Liste de toutes les commandes disponibles
  getCommandList: () => {
    return [
      { name: 'kick', description: 'Expulser un utilisateur' },
      { name: 'private', description: 'Rendre le salon privé' },
      { name: 'public', description: 'Rendre le salon public' },
      { name: 'rename', description: 'Renommer le salon' },
      { name: 'adduser', description: 'Ajouter un utilisateur' },
      { name: 'removeuser', description: 'Retirer un utilisateur' },
      { name: 'lock', description: 'Verrouiller le salon' },
      { name: 'unlock', description: 'Déverrouiller le salon' },
      { name: 'claim', description: 'Revendiquer un salon' },
      { name: 'transfer', description: 'Transférer la propriété' },
      { name: 'disband', description: 'Supprimer le salon' },
    ];
  },
};
