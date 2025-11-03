const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const configManager = require('../../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprimer des messages')
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription('Nombre de messages à supprimer (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    // Vérifier les permissions avec configManager
    const allowedRoles = configManager.getCommandPermissions(interaction.guildId, 'clear');
    
    // Si des rôles sont configurés, vérifier que l'utilisateur en a un
    if (allowedRoles.length > 0) {
      const hasAccess = allowedRoles.some(roleId => interaction.member.roles.cache.has(roleId));
      
      if (!hasAccess) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Permission refusée')
          .setDescription('Tu n\'as pas la permission pour utiliser cette commande.')
          .setFooter({ text: 'Demande au propriétaire pour accéder à cette commande' });
        return interaction.reply({ embeds: [embed], flags: 64 });
      }
    }

    try {
      await interaction.deferReply({ flags: 64 });

      const amount = interaction.options.getInteger('nombre');
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      
      if (messages.size === 0) {
        return await interaction.editReply({
          content: '❌ Aucun message à supprimer'
        });
      }

      const deleted = await interaction.channel.bulkDelete(messages, true);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Messages supprimés')
        .setDescription(`${deleted.size} message(s) ont été supprimé(s).`)
        .addFields({
          name: '📊 Statistiques',
          value: `• Canal: <#${interaction.channelId}>\n• Nombre: ${deleted.size}`,
          inline: false
        })
        .setFooter({ text: `Exécuté par ${interaction.user.username}` })
        .setTimestamp();
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur clear:', error);
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Erreur lors de la suppression des messages.')
        .addFields({
          name: '📝 Détails',
          value: '`Les messages sont peut-être trop vieux ou le bot n\'a pas les permissions`',
          inline: false
        });
      
      if (interaction.deferred) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed], flags: 64 });
      }
    }
  },
};
