// bot/utils/embedBuilder.js - Création d'embeds standardisés

const { EmbedBuilder } = require('discord.js');

const COLORS = {
  ERROR: '#FF0000',
  SUCCESS: '#00FF00',
  WARNING: '#FFA500',
  INFO: '#0099FF',
};

/**
 * Crée un embed d'erreur
 */
function createErrorEmbed(message) {
  return new EmbedBuilder()
    .setColor(COLORS.ERROR)
    .setTitle('❌ Erreur')
    .setDescription(message);
}

/**
 * Crée un embed de succès
 */
function createSuccessEmbed(message) {
  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Succès')
    .setDescription(message);
}

/**
 * Crée un embed de chargement
 */
function createLoadingEmbed(message) {
  return new EmbedBuilder()
    .setColor(COLORS.WARNING)
    .setTitle('⏳ Traitement')
    .setDescription(message);
}

/**
 * Crée un embed d'info
 */
function createInfoEmbed(title, message) {
  return new EmbedBuilder()
    .setColor(COLORS.INFO)
    .setTitle(title)
    .setDescription(message);
}

module.exports = {
  createErrorEmbed,
  createSuccessEmbed,
  createLoadingEmbed,
  createInfoEmbed,
  COLORS,
};
