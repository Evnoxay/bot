const { SlashCommandBuilder } = require('discord.js');
const { getManagedFromInteraction, allowUser } = require('./_shared');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adduser')
    .setDescription('Autorise un membre dans le salon')
    .addUserOption((o) => o.setName('utilisateur').setDescription('Membre').setRequired(true)),
  async execute(interaction) {
    const res = getManagedFromInteraction(interaction);
    if (res.error) return interaction.reply({ content: res.error, ephemeral: true });
    const user = interaction.options.getUser('utilisateur', true);
    await allowUser(res.channel, res.record, user.id, true);
    return interaction.reply({ content: `✅ ${user} a été autorisé.`, ephemeral: true });
  },
};
