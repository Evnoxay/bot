const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, '../data/serverConfig.json');

function hasCommandAccess(interaction, commandName) {
  try {
    if (!fs.existsSync(configFile)) return false;
    const conf = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const perms = conf[interaction.guildId]?.commandPermissions?.[commandName];
    if (!perms || perms.length === 0) return false;
    return perms.some(roleId => interaction.member.roles.cache.has(roleId));
  } catch {
    return false;
  }
}

module.exports = { hasCommandAccess };
