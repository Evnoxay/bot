const { createTemporaryChannel, cleanupOrTransfer } = require('../utils/voiceChannelManager');
const config = require('../config');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    if (newState.channelId === config.creatorVoiceChannelId) {
      await createTemporaryChannel(newState.member, config.creatorVoiceChannelId, config.categoryId);
    }
    if (oldState.channelId && oldState.channelId !== newState.channelId) {
      await cleanupOrTransfer(oldState);
    }
  },
};
