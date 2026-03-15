const { panelMessage } = require('../utils/voicePanel');

const triggers = new Set(['!vocpanel', '!panelvoc', '!voicepanel']);

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;
    if (!triggers.has(message.content.trim().toLowerCase())) return;
    await message.channel.send(panelMessage());
  },
};
