function isSnowflake(value) {
  return /^\d{6,25}$/.test(String(value || ''));
}

function canControlVoice(member, voiceRecord) {
  if (!member || !voiceRecord) return false;
  if (member.id === voiceRecord.ownerId) return true;
  if (voiceRecord.whitelist?.includes(member.id)) return true;
  return member.permissions.has('Administrator');
}

module.exports = {
  isSnowflake,
  canControlVoice,
};
