const fs = require('fs');
const path = require('path');

function hasCommandAccess(interaction, commandName) {
  try {
    const configPath = path.join(__dirname, '../data/serverConfig.json');
    if (!fs.existsSync(configPath)) return false;
    
    const conf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const perms = conf[interaction.guildId]?.commandPermissions?.[commandName];
    
    if (!perms || perms.length === 0) return false;
    
    return perms.some(roleId => interaction.member.roles.cache.has(roleId));
  } catch {
    return false;
  }
}

module.exports = { hasCommandAccess };
