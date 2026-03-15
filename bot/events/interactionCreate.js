const logger = require('../core/logger');
const { panelMessage, modalFor } = require('../utils/voicePanel');

async function runVocalAction(interaction, action, value) {
  const map = {
    lock: 'lock', unlock: 'unlock', rename: 'rename', adduser: 'adduser', removeuser: 'removeuser', kick: 'kick', transfer: 'transfer', disband: 'disband',
  };
  if (action === 'limit2') return interaction.client.commands.get('limit').execute(Object.assign(interaction, { options: { getInteger: () => 2 } }));
  if (action === 'limit0') return interaction.client.commands.get('limit').execute(Object.assign(interaction, { options: { getInteger: () => 0 } }));
  const cmdName = map[action];
  if (!cmdName) return interaction.reply({ content: 'Action non supportée.', ephemeral: true });

  const cmd = interaction.client.commands.get(cmdName);
  if (!cmd) return interaction.reply({ content: 'Commande introuvable.', ephemeral: true });

  const fake = {
    ...interaction,
    options: {
      getString: () => value,
      getUser: () => ({ id: value, toString: () => `<@${value}>` }),
      getInteger: () => Number(value),
    },
  };
  return cmd.execute(fake);
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction);
      } else if (interaction.isStringSelectMenu() && interaction.customId === 'vocpanel:action') {
        const action = interaction.values[0];
        const modal = modalFor(action);
        if (modal) return interaction.showModal(modal);
        await runVocalAction(interaction, action);
      } else if (interaction.isButton() && interaction.customId === 'vocpanel:refresh') {
        await interaction.update(panelMessage());
      } else if (interaction.isButton() && interaction.customId === 'vocpanel:help') {
        await interaction.reply({ content: 'Utilisez le menu pour agir sur votre salon temporaire.', ephemeral: true });
      } else if (interaction.isModalSubmit() && interaction.customId.startsWith('vocpanel:modal:')) {
        const action = interaction.customId.split(':').pop();
        const value = interaction.fields.getTextInputValue('value');
        await runVocalAction(interaction, action, value);
      }
    } catch (error) {
      logger.error('Erreur interaction', { error: error.message });
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: 'Une erreur est survenue.', ephemeral: true }).catch(() => null);
      } else {
        await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true }).catch(() => null);
      }
    }
  },
};
