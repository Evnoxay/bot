const { SlashCommandBuilder } = require('discord.js');
const { getGuildConfig } = require('../../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder().setName('adminrolelist').setDescription('Liste les rôles autorisés par commande'),
  async execute(interaction) {
    const cfg = getGuildConfig(interaction.guild.id);
    const perms = cfg.commandPermissions || {};
    if (!Object.keys(perms).length) {
      return interaction.reply({ content: 'Aucune permission personnalisée configurée.', ephemeral: true });
    }

    const lines = Object.entries(perms).map(([cmd, roles]) => `• /${cmd} → ${roles.map((id) => `<@&${id}>`).join(', ') || 'Aucun'}`);
    return interaction.reply({ content: lines.join('\n'), ephemeral: true });
  },
};
