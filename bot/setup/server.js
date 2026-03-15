const http = require('http');
const { serveStatic } = require('./lib/staticHandler');
const { handleApi } = require('./lib/apiHandlers');
const { pushLog } = require('./lib/logStore');

const PORT = process.env.SETUP_PORT || 3210;

const server = http.createServer(async (req, res) => {
  const apiHandled = await handleApi(req, res);
  if (apiHandled !== false) return;
  if (serveStatic(req, res)) return;
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  pushLog(`Setup web démarré sur http://localhost:${PORT}`);
  console.log(`🛠️  Setup: http://localhost:${PORT}`);
});
