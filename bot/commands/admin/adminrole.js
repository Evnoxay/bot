const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const configManager = require('../../utils/configManager');

function hasAdminroleAccess(interaction) {
  const isOwner = interaction.user.id === interaction.guild.ownerId;
  const adminrolePerms = configManager.getCommandPermissions(interaction.guildId, 'adminrole');
  
  if (isOwner) return true;
  return adminrolePerms.some(roleId => interaction.member.roles.cache.has(roleId));
}

function canModifyAdminrole(interaction) {
  return interaction.user.id === interaction.guild.ownerId;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adminrole')
    .setDescription('Configurer les rôles autorisés pour les commandes'),

  async execute(interaction) {
    if (!hasAdminroleAccess(interaction)) {
      return interaction.reply({
        content: '❌ Tu n\'as pas accès à `/adminrole`',
        flags: 64,
        ephemeral: true
      });
    }

    const commands = [
      { name: '/clear', value: 'clear', emoji: '🗑️' },
      { name: '/kick', value: 'kick', emoji: '🚪' },
      { name: '/ban', value: 'ban', emoji: '🔨' },
      { name: '/adminrole', value: 'adminrole', emoji: '⚙️' }
    ];

    const visibleCommands = canModifyAdminrole(interaction)
      ? commands
      : commands.filter(cmd => cmd.value !== 'adminrole');

    if (visibleCommands.length === 0) {
      return interaction.reply({
        content: '❌ Aucune commande disponible pour toi',
        flags: 64,
        ephemeral: true
      });
    }

    const options = visibleCommands.map(cmd => ({
      label: cmd.name,
      value: cmd.value,
      description: `Configurer ${cmd.name}`,
      emoji: cmd.emoji
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select-command-adminrole')
      .setPlaceholder('🔧 Choisis la commande à configurer')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const statusText = canModifyAdminrole(interaction)
      ? '🔐 Propriétaire - Accès complet'
      : '👤 Gestionnaire - Accès limité';

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('⚙️ Configuration des permissions')
      .setDescription('Sélectionne une commande pour configurer les rôles autorisés')
      .addFields({
        name: '📋 Commandes',
        value: options.map(opt => `${opt.emoji} \`${opt.label}\``).join('\n'),
        inline: false
      })
      .setFooter({ text: statusText })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};