const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction } = require('./_shared');
const { persistManaged } = require('../../utils/voiceChannelManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfère la propriété du salon')
    .addStringOption((o) => o.setName('utilisateur').setDescription('Mention ou ID').setRequired(true)),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    const targetId = interaction.options.getString('utilisateur', true).replace(/\D/g, '');
    if (!res.channel.members.has(targetId)) return interaction.reply({ content: 'Le membre doit être dans le salon.', ephemeral: true });
    res.record.ownerId = targetId;
    persistManaged(interaction.guild.id, res.channel.id, res.record);
    return interaction.reply({ content: `👑 Propriété transférée <@${targetId}>.`, ephemeral: true });
  },
};
