require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  guildId: process.env.GUILD_ID || '',
  creatorVoiceChannelId: process.env.CREATOR_VOICE_CHANNEL_ID || '',
  categoryId: process.env.CATEGORY_ID || '',
  debug: String(process.env.DEBUG).toLowerCase() === 'true',
};
