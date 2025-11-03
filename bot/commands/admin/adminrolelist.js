const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const configManager = require('../../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adminrolelist')
    .setDescription('Affiche la liste de tous les rôles configurés pour chaque commande'),

  async execute(interaction) {
    const commands = ['clear', 'kick', 'ban', 'adminrole'];
    
    const fields = [];
    let hasAnyPermissions = false;

    for (const cmd of commands) {
      const roleIds = configManager.getCommandPermissions(interaction.guildId, cmd);
      
      if (roleIds.length > 0) {
        hasAnyPermissions = true;
        const rolesList = roleIds.map(id => `<@&${id}>`).join(', ');
        
        const emoji = {
          'clear': '🗑️',
          'kick': '🚪',
          'ban': '🔨',
          'adminrole': '⚙️'
        }[cmd] || '📌';

        fields.push({
          name: `${emoji} \`/${cmd}\``,
          value: rolesList,
          inline: false
        });
      }
    }

    if (!hasAnyPermissions) {
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('📋 Liste des permissions')
        .setDescription('Aucune permission configurée sur ce serveur')
        .setFooter({ text: 'Utilise `/adminrole` pour configurer les permissions' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('📋 Liste des permissions configurées')
      .setDescription('Voici tous les rôles autorisés pour chaque commande')
      .addFields(fields)
      .setFooter({ text: 'Utilise `/adminrole` pour modifier les permissions' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
