// bot/commands/pic.js - AVEC UTILISATEUR OU ID
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const picCommand = {
  data: new SlashCommandBuilder()
    .setName('pic')
    .setDescription('Afficher la photo de profil d\'un utilisateur')
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

      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`${user.username}`)
        .setImage(user.displayAvatarURL({ size: 1024 }));
      
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors de l\'affichage de la photo!');
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};

module.exports = picCommand;
module.exports.picCommand = picCommand;
module.exports.data = picCommand.data;
module.exports.execute = picCommand.execute;