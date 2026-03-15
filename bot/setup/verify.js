const fs = require('fs');
const path = require('path');

const mustExist = [
  'bot/commands/vocal/lock.js',
  'bot/events/voiceStateUpdate.js',
  'bot/setup/server.js',
  'bot/core/loaders/commands.js',
  'bot/data/serverConfig.json',
];

console.log('=== DarwinBot Verify ===');
let ok = true;
for (const p of mustExist) {
  const exists = fs.existsSync(path.join(process.cwd(), p));
  if (!exists) ok = false;
  console.log(`${exists ? '✅' : '❌'} ${p}`);
}

try {
  const commandFiles = fs.readdirSync(path.join(process.cwd(), 'bot', 'commands', 'vocal')).filter((f) => f.endsWith('.js'));
  console.log(`✅ Commandes vocales détectées: ${commandFiles.length}`);
} catch (error) {
  ok = false;
  console.log(`❌ Erreur lecture commandes: ${error.message}`);
}

process.exit(ok ? 0 : 1);
