const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulse un utilisateur du salon')
    .addStringOption((o) => o.setName('utilisateur').setDescription('Mention, ID ou tag').setRequired(true)),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    const raw = interaction.options.getString('utilisateur', true).replace(/\D/g, '');
    const member = res.channel.members.get(raw);
    if (!member) return interaction.reply({ content: 'Membre introuvable dans le salon.', ephemeral: true });
    await member.voice.disconnect('Kick salon temporaire');
    return interaction.reply({ content: `👢 ${member.user.tag} expulsé.`, ephemeral: true });
  },
};
