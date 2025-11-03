const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeuser')
    .setDescription('Retirer un utilisateur du salon vocal')
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('L\'utilisateur à retirer')
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
      await voiceChannel.permissionOverwrites.delete(member);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Utilisateur retiré')
        .setDescription(`${user} a été retiré du salon vocal`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: 64, ephemeral: true });
    } catch (error) {
      console.error('Erreur removeuser:', error);
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors du retrait de l\'utilisateur');

      await interaction.reply({ embeds: [embed], flags: 64, ephemeral: true });
    }
  },
};