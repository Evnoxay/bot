module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log('✅ Commandes enregistrées sur Discord!');
    console.log(`📡 Bot prêt! Connecté en tant que: ${client.user.tag}\n`);

    // Commandes vocales qui doivent être restreintes aux salons vocaux
    const VOCAL_COMMANDS = ['adduser', 'removeuser', 'kick', 'transfer', 'lock', 'unlock', 'limit', 'disband', 'rename'];

    // Pour chaque serveur du bot
    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const commands = await guild.commands.fetch();

        for (const [cmdId, cmd] of commands) {
          // Si c'est une commande vocale
          if (VOCAL_COMMANDS.includes(cmd.name)) {
            // Récupère les salons vocaux du serveur
            const voiceChannels = guild.channels.cache.filter(c => c.isVoiceBased());

            if (voiceChannels.size > 0) {
              // Configure la commande SEULEMENT pour les salons vocaux
              await cmd.setDefaultMemberPermissions(0n); // Désactiver par défaut
              
              // Assigner la commande aux salons vocaux
              const permissions = voiceChannels.map(channel => ({
                id: channel.id,
                type: 'CHANNEL',
                permission: true
              }));

              await guild.commands.permissions.set({
                fullPermissions: [{
                  id: cmdId,
                  permissions: permissions
                }]
              });

              console.log(`✅ ${cmd.name} configuré pour les salons vocaux`);
            }
          }
        }
      } catch (error) {
        console.error(`Erreur configuration commandes vocales:`, error);
      }
    }
  }
};
