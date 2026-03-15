const fs = require('fs');
const path = require('path');

function loadCommands(client, commandsDir) {
  let count = 0;
  const walk = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full);
      if (item.isFile() && item.name.endsWith('.js')) {
        const command = require(full);
        if (command?.data?.name && typeof command.execute === 'function') {
          client.commands.set(command.data.name, command);
          count += 1;
        }
      }
    }
  };
  walk(commandsDir);
  return count;
}

module.exports = { loadCommands };
