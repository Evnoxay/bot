const path = require('path');
const { createClient } = require('./core/client');
const { loadCommands } = require('./core/loaders/commands');
const { loadEvents } = require('./core/loaders/events');
const { bootstrapConfig } = require('./utils/bootstrapConfig');
const { isSnowflake } = require('./utils/permission-utils');
const config = require('./config');
const logger = require('./core/logger');

bootstrapConfig();

const requiredIds = [
  ['CLIENT_ID', config.clientId],
  ['GUILD_ID', config.guildId],
  ['CREATOR_VOICE_CHANNEL_ID', config.creatorVoiceChannelId],
  ['CATEGORY_ID', config.categoryId],
];
for (const [name, value] of requiredIds) {
  if (value && !isSnowflake(value)) {
    logger.error(`Variable ${name} invalide. Attendu: 6 à 25 chiffres.`);
    process.exit(1);
  }
}
if (!config.token) {
  logger.error('DISCORD_TOKEN manquant dans .env');
  process.exit(1);
}

const client = createClient();
const commandCount = loadCommands(client, path.join(__dirname, 'commands'));
const eventCount = loadEvents(client, path.join(__dirname, 'events'));
logger.info(`Chargement terminé: ${commandCount} commandes, ${eventCount} événements.`);

client.login(config.token);
