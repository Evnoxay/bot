const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction, setLock } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder().setName('lock').setDescription('Verrouille votre salon vocal temporaire'),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    await setLock(res.channel, res.record, true);
    return interaction.reply({ content: '🔒 Salon verrouillé.', ephemeral: true });
  },
};
