const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limit')
    .setDescription('Définit la limite d\'utilisateurs du salon')
    .addIntegerOption((o) => o.setName('nombre').setDescription('0 à 99').setRequired(true).setMinValue(0).setMaxValue(99)),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    const n = interaction.options.getInteger('nombre', true);
    await res.channel.setUserLimit(n);
    return interaction.reply({ content: `👥 Limite définie à **${n}**.`, ephemeral: true });
  },
};
