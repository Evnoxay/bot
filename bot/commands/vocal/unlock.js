const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction, setLock } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder().setName('unlock').setDescription('Déverrouille votre salon vocal temporaire'),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    await setLock(res.channel, res.record, false);
    return interaction.reply({ content: '🔓 Salon déverrouillé.', ephemeral: true });
  },
};
