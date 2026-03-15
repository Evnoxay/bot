const { migrateServerConfig } = require('./core/config/migrateServerConfig');
const changed = migrateServerConfig();
console.log(changed ? '✅ Migration effectuée' : 'ℹ️  Aucune migration nécessaire');
