const { migrateServerConfig } = require('../core/config/migrateServerConfig');
const logger = require('../core/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    migrateServerConfig();
    const commands = client.commands.map((c) => c.data.toJSON());
    if (process.env.GUILD_ID) {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      await guild.commands.set(commands);
      logger.info(`Commandes enregistrées sur le serveur ${guild.name}`);
    } else {
      await client.application.commands.set(commands);
      logger.info('Commandes globales enregistrées.');
    }
    logger.info(`DarwinBot connecté en tant que ${client.user.tag}`);
  },
};
