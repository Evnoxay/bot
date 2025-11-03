#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DIAGNOSTIC DU BOT DISCORD\n');
console.log('=' .repeat(50));

const checks = [];

// 1. Vérifier les fichiers de commandes
console.log('\n📁 Vérification des fichiers de commandes...');
const commandsPath = path.join(__dirname, 'commands');
const expectedCommands = ['setup.js', 'adminrole.js', 'banner.js', 'pic.js', 'clear.js'];

for (const cmd of expectedCommands) {
  const filePath = path.join(commandsPath, cmd);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${cmd}`);
  checks.push({ name: `Command: ${cmd}`, status: exists });
}

// 2. Vérifier les fichiers vocal
console.log('\n📁 Vérification des fichiers vocal...');
const vocalPath = path.join(__dirname, 'commands', 'vocal');
const vocalFiles = fs.readdirSync(vocalPath).filter(f => f.endsWith('.js'));
console.log(`  ✅ Dossier vocal trouvé avec ${vocalFiles.length} fichiers`);
checks.push({ name: 'Dossier vocal', status: vocalFiles.length > 0 });

// 3. Vérifier les events
console.log('\n📁 Vérification des events...');
const eventsPath = path.join(__dirname, 'events');
const expectedEvents = ['interactionCreate.js', 'voiceStateUpdate.js', 'ready.js'];

for (const evt of expectedEvents) {
  const filePath = path.join(eventsPath, evt);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${evt}`);
  checks.push({ name: `Event: ${evt}`, status: exists });
}

// 4. Vérifier les utils
console.log('\n📁 Vérification des utilitaires...');
const utilsPath = path.join(__dirname, 'utils');
const expectedUtils = ['permission-utils.js'];

for (const util of expectedUtils) {
  const filePath = path.join(utilsPath, util);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${util}`);
  checks.push({ name: `Util: ${util}`, status: exists });
}

// 5. Vérifier les dossiers de données
console.log('\n📁 Vérification des dossiers de données...');
const dataPath = path.join(__dirname, 'data');
const dataExists = fs.existsSync(dataPath);
const status = dataExists ? '✅' : '⚠️';
console.log(`  ${status} Dossier data/ ${dataExists ? 'existe' : '(sera créé automatiquement)'}`);

const configPath = path.join(dataPath, 'serverConfig.json');
const configExists = fs.existsSync(configPath);
const configStatus = configExists ? '✅' : '⚠️';
console.log(`  ${configStatus} serverConfig.json ${configExists ? 'existe' : '(sera créé au premier /setup)'}`);

// 6. Vérifier les fichiers de configuration
console.log('\n📁 Vérification des fichiers de configuration...');
const configFiles = ['index.js', 'config.js', '.env'];

for (const cfg of configFiles) {
  const filePath = path.join(__dirname, '..', cfg);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${cfg}`);
  checks.push({ name: `Config: ${cfg}`, status: exists });
}

// 7. Vérifier les features
console.log('\n📁 Vérification des features...');
const featuresPath = path.join(__dirname, 'features');
const expectedFeatures = ['voiceChannelManager.js', 'permissionManager.js'];

for (const feat of expectedFeatures) {
  const filePath = path.join(featuresPath, feat);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${feat}`);
  checks.push({ name: `Feature: ${feat}`, status: exists });
}

// 8. Résumé
console.log('\n' + '='.repeat(50));
const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status).length;
const percentage = Math.round((passedChecks / totalChecks) * 100);

console.log(`\n📊 Résumé: ${passedChecks}/${totalChecks} vérifications réussies (${percentage}%)\n`);

if (percentage === 100) {
  console.log('✅ TOUT EST BON ! Le bot est prêt à démarrer !\n');
} else if (percentage >= 80) {
  console.log('⚠️  Quelques fichiers manquent, mais le bot devrait fonctionner.\n');
} else {
  console.log('❌ Des fichiers importants manquent. Vérifiez l\'installation.\n');
}

console.log('=' .repeat(50) + '\n');
