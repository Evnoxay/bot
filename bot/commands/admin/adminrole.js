const { SlashCommandBuilder } = require('discord.js');
const { setAllowedRoles } = require('../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adminrole')
    .setDescription('Définit les rôles autorisés pour une commande')
    .addStringOption((o) =>
      o
        .setName('commande')
        .setDescription('Nom de la commande')
        .setRequired(true)
        .addChoices(
          { name: 'clear', value: 'clear' },
          { name: 'kick', value: 'kick' },
          { name: 'ban', value: 'ban' },
          { name: 'adminrole', value: 'adminrole' },
        ),
    )
    .addStringOption((o) => o.setName('roles').setDescription('IDs rôles séparés par des virgules').setRequired(true)),
  async execute(interaction) {
    if (interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({ content: 'Seul le propriétaire du serveur peut modifier cette permission.', ephemeral: true });
    }

    const command = interaction.options.getString('commande', true);
    const rolesRaw = interaction.options.getString('roles', true);
    const roleIds = rolesRaw.split(',').map((v) => v.trim()).filter(Boolean);
    setAllowedRoles(interaction.guild.id, command, roleIds);
    return interaction.reply({ content: `✅ Permissions mises à jour pour **/${command}**.`, ephemeral: true });
  },
};
