const fs = require('fs');
const path = require('path');

const channelsFile = path.join(__dirname, '../data/channels.json');

function ensureFile() {
  if (!fs.existsSync(channelsFile)) {
    fs.writeFileSync(channelsFile, JSON.stringify({}, null, 2));
  }
}

function registerChannel(channelId, ownerId, guildId) {
  ensureFile();
  let data = JSON.parse(fs.readFileSync(channelsFile, 'utf8'));
  data[channelId] = {
    ownerId,
    guildId,
    whitelist: [ownerId],
    blacklist: [],
  };
  fs.writeFileSync(channelsFile, JSON.stringify(data, null, 2));
}

function unregisterChannel(channelId) {
  ensureFile();
  let data = JSON.parse(fs.readFileSync(channelsFile, 'utf8'));
  delete data[channelId];
  fs.writeFileSync(channelsFile, JSON.stringify(data, null, 2));
}

function getChannelData(channelId) {
  ensureFile();
  let data = JSON.parse(fs.readFileSync(channelsFile, 'utf8'));
  return data[channelId] || null;
}

function updateChannelData(channelId, newData) {
  ensureFile();
  let data = JSON.parse(fs.readFileSync(channelsFile, 'utf8'));
  data[channelId] = newData;
  fs.writeFileSync(channelsFile, JSON.stringify(data, null, 2));
}

function isTrackedChannel(channelId) {
  ensureFile();
  let data = JSON.parse(fs.readFileSync(channelsFile, 'utf8'));
  return channelId in data;
}

module.exports = {
  registerChannel,
  unregisterChannel,
  getChannelData,
  updateChannelData,
  isTrackedChannel,
};
