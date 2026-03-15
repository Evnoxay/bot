const { getGuildConfig, setGuildConfig } = require('../utils/configManager');

function getAllowedRoles(guildId, commandName) {
  const cfg = getGuildConfig(guildId);
  return cfg.commandPermissions?.[commandName] || [];
}

function setAllowedRoles(guildId, commandName, roleIds) {
  return setGuildConfig(guildId, (cfg) => {
    cfg.commandPermissions = cfg.commandPermissions || {};
    cfg.commandPermissions[commandName] = roleIds;
    return cfg;
  });
}

function hasCommandAccess(member, commandName) {
  if (!member) return false;
  if (member.permissions.has('Administrator')) return true;
  const allowed = getAllowedRoles(member.guild.id, commandName);
  if (!allowed.length) return true;
  return member.roles.cache.some((r) => allowed.includes(r.id));
}

module.exports = { getAllowedRoles, setAllowedRoles, hasCommandAccess };
