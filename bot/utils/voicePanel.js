const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { infoEmbed } = require('./embedBuilder');

function panelMessage() {
  const select = new StringSelectMenuBuilder()
    .setCustomId('vocpanel:action')
    .setPlaceholder('Choisissez une action vocale')
    .addOptions([
      { label: 'Lock', value: 'lock' },
      { label: 'Unlock', value: 'unlock' },
      { label: 'Limit 2', value: 'limit2' },
      { label: 'Limit 0 (illimité)', value: 'limit0' },
      { label: 'Rename', value: 'rename' },
      { label: 'Add user', value: 'adduser' },
      { label: 'Remove user', value: 'removeuser' },
      { label: 'Kick', value: 'kick' },
      { label: 'Transfer', value: 'transfer' },
      { label: 'Disband', value: 'disband' },
    ]);

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('vocpanel:refresh').setLabel('Refresh').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('vocpanel:help').setLabel('Aide').setStyle(ButtonStyle.Primary),
  );

  return {
    embeds: [infoEmbed('Panneau vocal', 'Pilotez votre salon vocal temporaire avec ce menu.')],
    components: [new ActionRowBuilder().addComponents(select), buttons],
  };
}

function modalFor(action) {
  const map = {
    rename: ['Nouveau nom', 'nom'],
    adduser: ['ID membre', 'user'],
    removeuser: ['ID membre', 'user'],
    kick: ['ID membre', 'user'],
    transfer: ['ID nouveau propriétaire', 'user'],
  };
  const cfg = map[action];
  if (!cfg) return null;

  const input = new TextInputBuilder()
    .setCustomId('value')
    .setLabel(cfg[0])
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  return new ModalBuilder()
    .setCustomId(`vocpanel:modal:${action}`)
    .setTitle(`Action ${action}`)
    .addComponents(new ActionRowBuilder().addComponents(input));
}

module.exports = { panelMessage, modalFor };
