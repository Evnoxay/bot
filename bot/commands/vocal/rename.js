const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Renomme le salon vocal')
    .addStringOption((o) => o.setName('nom').setDescription('Nouveau nom').setRequired(true)),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    const nom = interaction.options.getString('nom', true).slice(0, 90);
    await res.channel.setName(nom);
    return interaction.reply({ content: `✏️ Salon renommé en **${nom}**.`, ephemeral: true });
  },
};
