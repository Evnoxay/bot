const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const voiceChannelManager = require('../../utils/voiceChannelManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adduser')
    .setDescription('Ajouter un utilisateur au salon vocal')
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('L\'utilisateur à ajouter')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const guild = interaction.guild;

    try {
      const voiceChannel = await guild.channels.fetch(interaction.channel.parentId);
      
      if (!voiceChannel) {
        return interaction.reply({
          content: '❌ Salon vocal introuvable',
          flags: 64,
          ephemeral: true
        });
      }

      const member = await guild.members.fetch(user.id);
      await voiceChannel.permissionOverwrites.create(member, {
        Connect: true,
        Speak: true,
        ViewChannel: true,
      });

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Utilisateur ajouté')
        .setDescription(`${user} a été autorisé à accéder au salon vocal`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: 64, ephemeral: true });
    } catch (error) {
      console.error('Erreur adduser:', error);
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors de l\'ajout de l\'utilisateur');

      await interaction.reply({ embeds: [embed], flags: 64, ephemeral: true });
    }
  },
};
