const fs = require('fs');
const path = require('path');

function ensureFile(filePath, defaultData) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
}

function bootstrapConfig() {
  ensureFile(path.join(__dirname, '..', 'data', 'serverConfig.json'), {});
  ensureFile(path.join(__dirname, '..', 'data', 'admins.json'), {});
  ensureFile(path.join(process.cwd(), 'data', 'serverConfig.json'), {});
}

module.exports = { bootstrapConfig };
