const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Affiche la bannière d\'un utilisateur')
    .addUserOption((o) => o.setName('utilisateur').setDescription('Utilisateur ciblé').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const fetched = await interaction.client.users.fetch(user.id, { force: true });
    return interaction.reply({ content: fetched.bannerURL({ size: 1024 }) || 'Aucune bannière.' });
  },
};
