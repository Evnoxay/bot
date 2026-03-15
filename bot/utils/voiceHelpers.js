function getVoiceChannelFromInteraction(interaction) {
  return interaction.member?.voice?.channel || null;
}

function firstMemberExcept(channel, memberId) {
  return channel.members.filter((m) => m.id !== memberId).first() || null;
}

module.exports = { getVoiceChannelFromInteraction, firstMemberExcept };
