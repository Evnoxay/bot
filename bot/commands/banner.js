// bot/commands/banner.js - AVEC UTILISATEUR OU ID
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const bannerCommand = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Afficher la bannière de profil d\'un utilisateur')
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('L\'utilisateur (par défaut toi-même)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('id')
        .setDescription('L\'ID de l\'utilisateur')
        .setRequired(false)
    ),
  execute: async (interaction) => {
    const userOption = interaction.options.getUser('utilisateur');
    const idOption = interaction.options.getString('id');
    let user;

    try {
      if (userOption) {
        user = userOption;
      } else if (idOption) {
        user = await interaction.client.users.fetch(idOption);
      } else {
        user = interaction.user;
      }

      if (!user) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Erreur')
          .setDescription('Utilisateur introuvable!');
        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      const userProfile = await user.fetch();
      const bannerURL = userProfile.bannerURL({ size: 1024 });

      if (!bannerURL) {
        const embed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('⚠️ Information')
          .setDescription(`${user.username} n\'a pas de bannière personnalisée!`);
        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`${user.username}`)
        .setImage(bannerURL);
      
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors de l\'affichage de la bannière!');
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};

module.exports = bannerCommand;
module.exports.bannerCommand = bannerCommand;
module.exports.data = bannerCommand.data;
module.exports.execute = bannerCommand.execute;