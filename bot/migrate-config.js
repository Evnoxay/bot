const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/serverConfig.json');

console.log('🔄 Migration de la configuration...\n');

if (!fs.existsSync(configPath)) {
  console.log('❌ Fichier serverConfig.json introuvable');
  process.exit(1);
}

try {
  let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let hasChanges = false;

  for (const guildId in config) {
    const guildConfig = config[guildId];

    // Si allowedRoleId existe mais pas commandPermissions
    if (guildConfig.allowedRoleId && !guildConfig.commandPermissions) {
      console.log(`📋 Guild ${guildId}:`);
      console.log(`   Ancien format détecté (allowedRoleId: ${guildConfig.allowedRoleId})`);
      
      // Migration automatique
      guildConfig.commandPermissions = {
        clear: [guildConfig.allowedRoleId],
        kick: [guildConfig.allowedRoleId],
        ban: [guildConfig.allowedRoleId],
      };

      console.log(`   ✅ Migré vers nouveau format (commandPermissions)`);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('\n✅ Migration réussie !');
  } else {
    console.log('ℹ️  Aucune migration nécessaire');
  }

} catch (error) {
  console.error('❌ Erreur lors de la migration:', error);
  process.exit(1);
}