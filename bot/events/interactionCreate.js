const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const configManager = require('../utils/configManager');

const isOwner = (interaction) => interaction.user.id === interaction.guild.ownerId;

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Gère les slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'Il y a eu une erreur lors de l\'exécution de cette commande!',
            flags: 64,
          });
        } else {
          await interaction.reply({
            content: 'Il y a eu une erreur lors de l\'exécution de cette commande!',
            flags: 64,
          });
        }
      }
      return;
    }

    if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

    try {
      if (interaction.isStringSelectMenu() && interaction.customId === 'select-command-adminrole') {
        await handleCommandSelection(interaction);
      } else if (interaction.isStringSelectMenu() && interaction.customId.startsWith('select-roles|')) {
        await handleRoleSelection(interaction);
      } else if (interaction.isButton() && interaction.customId.startsWith('delete-all|')) {
        await handleDeleteAll(interaction);
      }
    } catch (error) {
      console.error('❌ Erreur interactionCreate:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Une erreur s\'est produite',
          flags: 64,
          ephemeral: true
        });
      }
    }
  }
};

async function handleCommandSelection(interaction) {
  await interaction.deferUpdate();

  const selectedCommand = interaction.values[0];

  if (selectedCommand === 'adminrole' && !isOwner(interaction)) {
    return interaction.followUp({
      content: '❌ Seul le propriétaire peut modifier les permissions de `/adminrole`',
      flags: 64,
      ephemeral: true
    });
  }

  const roles = interaction.guild.roles.cache.filter(r => r.name !== '@everyone');
  const options = roles.map(role => ({ label: role.name, value: role.id }));

  if (options.length === 0) {
    return interaction.editReply({
      content: '❌ Aucun rôle disponible sur ce serveur.',
      components: []
    });
  }

  const currentRoles = configManager.getCommandPermissions(interaction.guildId, selectedCommand);
  const currentRolesText = currentRoles.length > 0
    ? currentRoles.map(id => `<@&${id}>`).join(', ')
    : '❌ Aucun rôle';

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`select-roles|${selectedCommand}`)
    .setPlaceholder('Choisis les rôles autorisés')
    .setMinValues(0)
    .addOptions(options.slice(0, 25))
    .setMaxValues(Math.min(25, options.length));

  const deleteBtn = new ButtonBuilder()
    .setCustomId(`delete-all|${selectedCommand}`)
    .setLabel('🗑️ Supprimer tous les rôles')
    .setStyle(ButtonStyle.Danger);

  const row1 = new ActionRowBuilder().addComponents(selectMenu);
  const row2 = new ActionRowBuilder().addComponents(deleteBtn);

  const embed = new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle(`Configuration : \`/${selectedCommand}\``)
    .setDescription('Sélectionne les rôles qui auront accès à cette commande')
    .addFields({
      name: '👥 Rôles actuellement autorisés',
      value: currentRolesText,
      inline: false
    })
    .setTimestamp();

  await interaction.editReply({
    embeds: [embed],
    components: [row1, row2]
  });
}

async function handleRoleSelection(interaction) {
  await interaction.deferUpdate();

  const commandName = interaction.customId.split('|')[1];
  const selectedRoles = interaction.values;

  if (commandName === 'adminrole' && !isOwner(interaction)) {
    return interaction.followUp({
      content: '❌ Seul le propriétaire peut modifier les permissions de `/adminrole`',
      flags: 64,
      ephemeral: true
    });
  }

  const success = configManager.setCommandPermissions(interaction.guildId, commandName, selectedRoles);

  if (!success) {
    return interaction.editReply({
      content: '❌ Erreur lors de la sauvegarde',
      components: []
    });
  }

  if (selectedRoles.length === 0) {
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('🗑️ Permissions supprimées')
      .setDescription(`Les permissions pour \`/${commandName}\` ont été supprimées`)
      .setTimestamp();

    return await interaction.editReply({
      embeds: [embed],
      components: []
    });
  }

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('✅ Permissions enregistrées')
    .setDescription(`Configuration pour \`/${commandName}\` sauvegardée`)
    .addFields({
      name: '👥 Rôles autorisés',
      value: selectedRoles.map(id => `<@&${id}>`).join(', '),
      inline: false
    })
    .setTimestamp();

  await interaction.editReply({
    embeds: [embed],
    components: []
  });
}

async function handleDeleteAll(interaction) {
  await interaction.deferUpdate();

  const commandName = interaction.customId.split('|')[1];

  if (commandName === 'adminrole' && !isOwner(interaction)) {
    return interaction.followUp({
      content: '❌ Seul le propriétaire peut modifier les permissions de `/adminrole`',
      flags: 64,
      ephemeral: true
    });
  }

  const success = configManager.deleteCommandPermissions(interaction.guildId, commandName);

  if (!success) {
    return interaction.editReply({
      content: '❌ Erreur lors de la suppression',
      components: []
    });
  }

  const embed = new EmbedBuilder()
    .setColor('#FF6B6B')
    .setTitle('🗑️ Tous les rôles supprimés')
    .setDescription(`Les permissions pour \`/${commandName}\` ont été complètement supprimées`)
    .setTimestamp();

  await interaction.editReply({
    embeds: [embed],
    components: []
  });
}
