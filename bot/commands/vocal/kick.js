const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const voiceChannelManager = require('../../../features/voiceChannelManager');
const permissionManager = require('../../../features/permissionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un utilisateur de ton salon vocal')
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription("L'utilisateur à expulser")
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('id')
        .setDescription("L'ID de l'utilisateur à expulser")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Tu dois être dans un salon vocal!');
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (!voiceChannelManager.isTrackedChannel(channel.id)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription("Ce n'est pas un salon créé par le bot!");
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (!permissionManager.isChannelOwner(channel.id, interaction.user.id)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription("Tu n'es pas le propriétaire de ce salon.");
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    const userOption = interaction.options.getUser('utilisateur');
    const idOption = interaction.options.getString('id');
    let userToKick;

    try {
      if (userOption) {
        userToKick = userOption;
      } else if (idOption) {
        userToKick = await interaction.client.users.fetch(idOption);
      } else {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Erreur')
          .setDescription('Tu dois spécifier un utilisateur ou un ID!');
        return interaction.reply({ embeds: [embed], flags: 64 });
      }
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription('Utilisateur introuvable!');
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (userToKick.id === interaction.user.id) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription("Tu ne peux pas t'expulser toi-même!");
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    const member = interaction.guild.members.cache.get(userToKick.id);

    if (!member.voice.channel || member.voice.channelId !== channel.id) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription("Cet utilisateur n'est pas dans ton salon!");
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    try {
      await member.voice.disconnect('Expulsé par le propriétaire du salon');
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Succès')
        .setDescription(`${userToKick.username} a été expulsé!`);
      interaction.reply({ embeds: [embed], flags: 64 });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Erreur')
        .setDescription("Erreur lors de l'expulsion!");
      interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};