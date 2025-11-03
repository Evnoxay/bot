const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const voiceChannelManager = require('../../../features/voiceChannelManager');
const permissionManager = require('../../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Renommer ton salon vocal')
    .addStringOption(option =>
      option.setName('nom')
        .setDescription('Le nouveau nom du salon')
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const channel = interaction.member.voice.channel;
    const newName = interaction.options.getString('nom');

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
      await channel.setName(`🎤 ${newName}`);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Succès')
        .setDescription(`Salon renommé en: **${newName}**`);
      interaction.reply({ embeds: [embed], flags: 64 });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors du renommage!');
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};