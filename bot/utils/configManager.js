const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'data', 'serverConfig.json');

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (_) {
    return {};
  }
}

function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getGuildConfig(guildId) {
  const all = readConfig();
  if (!all[guildId]) {
    all[guildId] = { commandPermissions: {}, managedChannels: {} };
    writeConfig(all);
  }
  if (!all[guildId].commandPermissions) all[guildId].commandPermissions = {};
  if (!all[guildId].managedChannels) all[guildId].managedChannels = {};
  return all[guildId];
}

function setGuildConfig(guildId, updater) {
  const all = readConfig();
  const current = all[guildId] || { commandPermissions: {}, managedChannels: {} };
  all[guildId] = updater(current);
  writeConfig(all);
  return all[guildId];
}

module.exports = {
  configPath,
  readConfig,
  writeConfig,
  getGuildConfig,
  setGuildConfig,
};
