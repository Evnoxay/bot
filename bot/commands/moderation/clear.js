const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { hasCommandAccess } = require('../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime en masse les messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((o) => o.setName('nombre').setDescription('1 à 100').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    if (!hasCommandAccess(interaction.member, 'clear')) {
      return interaction.reply({ content: 'Vous n\'êtes pas autorisé à utiliser cette commande.', ephemeral: true });
    }
    const n = interaction.options.getInteger('nombre', true);
    const deleted = await interaction.channel.bulkDelete(n, true);
    return interaction.reply({ content: `🧹 ${deleted.size} message(s) supprimé(s).`, ephemeral: true });
  },
};
