const { SlashCommandBuilder } = require('discord.js');
const permissionManager = require('../../../features/permissionManager');
const { createSuccessEmbed, createErrorEmbed } = require('../../../bot/utils/embedBuilder');
const { checkVoiceCommand, getUserFromOptions, checkUserInChannel } = require('../../../bot/utils/voiceHelpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transférer la propriété du salon à un autre utilisateur')
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription("L'utilisateur qui aura la propriété")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('id')
        .setDescription("L'ID de l'utilisateur qui aura la propriété")
        .setRequired(false)
    ),

  async execute(interaction) {
    // Vérifications vocales
    const { error: voiceError, channel } = checkVoiceCommand(interaction);
    if (voiceError) {
      return interaction.reply({ embeds: [voiceError], flags: 64 });
    }

    // Récupérer l'utilisateur
    const { error: userError, user: newOwner } = await getUserFromOptions(interaction);
    if (userError) {
      return interaction.reply({ embeds: [userError], flags: 64 });
    }

    // Vérifier que le nouvel owner est dans le salon
    const { error: channelError } = checkUserInChannel(interaction, newOwner, channel);
    if (channelError) {
      return interaction.reply({ embeds: [channelError], flags: 64 });
    }

    try {
      // Transférer la propriété
      permissionManager.transferOwnership(channel.id, newOwner.id);
      
      // Mettre à jour les permissions
      await channel.permissionOverwrites.set([
        {
          id: interaction.guild.id,
          allow: ['Connect'],
        },
        {
          id: newOwner.id,
          allow: ['Connect', 'Speak'],
        },
      ]);

      return interaction.reply({
        embeds: [createSuccessEmbed(`La propriété a été transférée à ${newOwner.username}!`)],
        flags: 64
      });
    } catch (error) {
      console.error('Erreur transfer:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('Erreur lors du transfert!')],
        flags: 64
      });
    }
  },
};