const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const voiceChannelManager = require('../../../features/voiceChannelManager');
const permissionManager = require('../../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disband')
    .setDescription('Supprimer ton salon vocal'),
  execute: async (interaction) => {
    const channel = interaction.member.voice.channel;

    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Tu dois être dans un salon vocal!');
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (!permissionManager.isChannelOwner(channel.id, interaction.user.id)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Tu n\'es pas le propriétaire de ce salon.');
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    try {
      const channelName = channel.name;
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Succès')
        .setDescription(`Le salon **${channelName}** a été supprimé!`);
      await interaction.reply({ embeds: [embed], flags: 64 });

      voiceChannelManager.unregisterChannel(channel.id);
      await channel.delete('Salon supprimé par le propriétaire');
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors de la suppression!');
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};