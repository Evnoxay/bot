const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction, disbandChannel } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder().setName('disband').setDescription('Supprime le salon temporaire'),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    await interaction.reply({ content: '🧨 Suppression du salon...', ephemeral: true });
    await disbandChannel(res.channel);
  },
};
