const fs = require('fs');
const path = require('path');

const mimeMap = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function serveStatic(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, '..', 'public', urlPath);
  if (!filePath.startsWith(path.join(__dirname, '..', 'public'))) return false;
  if (!fs.existsSync(filePath)) return false;
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'text/plain' });
  res.end(fs.readFileSync(filePath));
  return true;
}

module.exports = { serveStatic };
