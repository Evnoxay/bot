const fs = require('fs');
const path = require('path');
const { json, readBody } = require('./httpHelpers');
const { getLogs, pushLog } = require('./logStore');
const { bootstrapConfig } = require('../../utils/bootstrapConfig');

const envPath = path.join(process.cwd(), '.env');
const configPath = path.join(__dirname, '..', '..', 'data', 'serverConfig.json');
const idPattern = /^\d{6,25}$/;

function readEnv() {
  const raw = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  return Object.fromEntries(raw.split('\n').filter(Boolean).map((line) => line.split('=')));
}

function writeEnv(obj) {
  const content = Object.entries(obj).map(([k, v]) => `${k}=${v || ''}`).join('\n');
  fs.writeFileSync(envPath, `${content}\n`);
}

function validate(payload) {
  const fields = ['CLIENT_ID', 'GUILD_ID', 'CREATOR_VOICE_CHANNEL_ID', 'CATEGORY_ID'];
  const errors = [];
  for (const field of fields) {
    if (!idPattern.test(String(payload[field] || ''))) {
      errors.push(`${field} invalide (6-25 chiffres)`);
    }
  }
  if (!payload.DISCORD_TOKEN) errors.push('DISCORD_TOKEN manquant');
  return errors;
}

async function handleApi(req, res) {
  if (req.method === 'GET' && req.url === '/api/status') {
    const env = readEnv();
    return json(res, 200, { ok: true, envLoaded: !!env.DISCORD_TOKEN, configFile: fs.existsSync(configPath) });
  }

  if (req.method === 'GET' && req.url === '/api/defaults') {
    return json(res, 200, { port: 3210, debug: false });
  }

  if (req.method === 'GET' && req.url === '/api/preview') {
    const env = readEnv();
    const invite = env.CLIENT_ID
      ? `https://discord.com/oauth2/authorize?client_id=${env.CLIENT_ID}&scope=bot%20applications.commands&permissions=8`
      : '';
    return json(res, 200, { invite, checklist: ['Configurer .env', 'Lancer npm run verify', 'Lancer npm start'] });
  }

  if (req.method === 'GET' && req.url === '/api/logs') {
    return json(res, 200, getLogs());
  }

  if (req.method === 'POST' && req.url === '/api/setup') {
    try {
      const body = await readBody(req);
      const errors = validate(body);
      if (errors.length) return json(res, 400, { ok: false, errors });

      writeEnv({ ...readEnv(), ...body, DEBUG: body.DEBUG || 'false' });
      bootstrapConfig();
      if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, '{}');
      pushLog('Setup enregistré avec succès.');
      return json(res, 200, { ok: true });
    } catch (error) {
      pushLog(`Erreur setup: ${error.message}`, 'error');
      return json(res, 500, { ok: false, error: error.message });
    }
  }

  return false;
}

module.exports = { handleApi };
