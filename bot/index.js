const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

// ========== CHARGEMENT RÉCURSIF DES COMMANDES ==========
function loadCommandsRecursively(dir, depth = 0) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      count += loadCommandsRecursively(filePath, depth + 1);
    } else if (file.endsWith('.js')) {
      try {
        const commandModule = require(filePath);
        
        if (typeof commandModule === 'object' && !commandModule.data && !commandModule.execute) {
          for (const [name, command] of Object.entries(commandModule)) {
            if (command.data && command.execute) {
              client.commands.set(name, command);
              count++;
            }
          }
        } else if (commandModule.data && commandModule.execute) {
          client.commands.set(commandModule.data.name, commandModule);
          count++;
        }
      } catch (error) {
        console.error(`❌ Erreur chargement ${file}:`, error.message);
      }
    }
  }
  
  return count;
}

console.log('\n🚀 DÉMARRAGE DU BOT DISCORD\n');
console.log('═══════════════════════════════════════════════════════════');

const commandsPath = path.join(__dirname, 'commands');
const totalCommands = loadCommandsRecursively(commandsPath);

console.log(`\n✅ ${totalCommands} commandes chargées`);
console.log('═══════════════════════════════════════════════════════════\n');

// ========== CHARGEMENT DES ÉVÉNEMENTS ==========
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ========== ENREGISTREMENT DES COMMANDES SLASH ==========
client.on('ready', async () => {
  try {
    const commands = client.commands.map(cmd => cmd.data.toJSON());
    await client.application.commands.set(commands);
    console.log('✅ Commandes enregistrées sur Discord!');
    console.log(`📡 Bot prêt! Connecté en tant que: ${client.user.tag}\n`);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des commandes:', error);
  }
});

// ========== MIGRATION AUTO DE CONFIG ==========
console.log('🔄 Vérification migration config...');
const configPath = path.join(__dirname, 'data/serverConfig.json');

if (fs.existsSync(configPath)) {
  try {
    let configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    let hasChanges = false;

    for (const guildId in configData) {
      const guildConfig = configData[guildId];

      if (guildConfig.allowedRoleId && !guildConfig.commandPermissions) {
        guildConfig.commandPermissions = {
          clear: [guildConfig.allowedRoleId],
          kick: [guildConfig.allowedRoleId],
          ban: [guildConfig.allowedRoleId],
        };

        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
      console.log('✅ Migration config réussie\n');
    } else {
      console.log('ℹ️  Config déjà à jour\n');
    }
  } catch (error) {
    console.error('❌ Erreur migration:', error);
  }
}

client.login(config.token);
