const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const permissionManager = require('../../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limit')
    .setDescription('Limiter le nombre de personnes dans ton salon vocal')
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription('Nombre maximum de personnes (0 = illimité)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(99)
    ),
  execute: async (interaction) => {
    const channel = interaction.member.voice.channel;
    const limit = interaction.options.getInteger('nombre');

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
      await channel.setUserLimit(limit);
      
      let description;
      if (limit === 0) {
        description = 'Le salon est maintenant **illimité**!';
      } else {
        description = `Le salon est limité à **${limit}** personne${limit > 1 ? 's' : ''}!`;
      }

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Succès')
        .setDescription(description);
      interaction.reply({ embeds: [embed], flags: 64 });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors de la modification de la limite!');
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};