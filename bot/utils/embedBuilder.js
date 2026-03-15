const { EmbedBuilder } = require('discord.js');

function infoEmbed(title, description) {
  return new EmbedBuilder().setColor(0x00a8ff).setTitle(title).setDescription(description).setTimestamp();
}

function errorEmbed(description) {
  return new EmbedBuilder().setColor(0xff3b30).setTitle('Erreur').setDescription(description).setTimestamp();
}

module.exports = { infoEmbed, errorEmbed };
