const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pic')
    .setDescription('Affiche l\'avatar d\'un utilisateur')
    .addUserOption((o) => o.setName('utilisateur').setDescription('Utilisateur ciblé').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    return interaction.reply({ content: user.displayAvatarURL({ size: 1024 }) });
  },
};
