const { readConfig, writeConfig } = require('../../utils/configManager');

function migrateServerConfig() {
  const config = readConfig();
  let changed = false;

  for (const guildId of Object.keys(config)) {
    const guild = config[guildId];
    if (!guild.commandPermissions) {
      guild.commandPermissions = {};
      changed = true;
    }
    if (!guild.managedChannels) {
      guild.managedChannels = {};
      changed = true;
    }
  }

  if (changed) writeConfig(config);
  return changed;
}

module.exports = { migrateServerConfig };
