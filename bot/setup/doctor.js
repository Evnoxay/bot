const fs = require('fs');
const path = require('path');

const checks = [];
checks.push({ name: 'Node.js >= 18', ok: Number(process.versions.node.split('.')[0]) >= 18 });
checks.push({ name: '.env présent', ok: fs.existsSync(path.join(process.cwd(), '.env')) });
checks.push({ name: 'bot/index.js présent', ok: fs.existsSync(path.join(process.cwd(), 'bot', 'index.js')) });
checks.push({ name: 'data/serverConfig.json présent', ok: fs.existsSync(path.join(process.cwd(), 'bot', 'data', 'serverConfig.json')) });

console.log('=== DarwinBot Doctor ===');
for (const c of checks) console.log(`${c.ok ? '✅' : '❌'} ${c.name}`);
process.exit(checks.every((c) => c.ok) ? 0 : 1);
