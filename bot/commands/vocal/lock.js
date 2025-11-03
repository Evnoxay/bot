const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const voiceChannelManager = require('../../../features/voiceChannelManager');
const permissionManager = require('../../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Verrouiller ton salon vocal (personne ne peut rejoindre)'),
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

    const data = voiceChannelManager.getChannelData(channel.id);
    if (data.isLocked) {
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('🔐 Information')
        .setDescription('Le salon est déjà verrouillé!');
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    try {
      await channel.permissionOverwrites.set([
        {
          id: interaction.guild.id,
          deny: ['Connect'],
        },
        ...data.whitelist.map(userId => ({
          id: userId,
          allow: ['Connect', 'Speak'],
        })),
      ]);

      permissionManager.lockChannel(channel.id);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🔐 Succès')
        .setDescription('Le salon est maintenant verrouillé!');
      interaction.reply({ embeds: [embed], flags: 64 });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur!');
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};
