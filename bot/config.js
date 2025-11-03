/**
 * Configuration du Bot Discord
 */

require('dotenv').config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    creatorVoiceChannelId: process.env.CREATOR_VOICE_CHANNEL_ID,
    categoryId: process.env.CATEGORY_ID,
    
    bot: {
        prefix: '/',
    },
    
    voiceChannels: {
        autoDeleteEmpty: true,
        maxNameLength: 32,
        defaultBitrate: 64000
    },
    
    debug: process.env.DEBUG === 'true' || false
};
