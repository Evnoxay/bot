const logs = [];

function pushLog(message, level = 'info') {
  logs.push({ ts: new Date().toISOString(), level, message });
  if (logs.length > 200) logs.shift();
}

function getLogs() {
  return logs;
}

module.exports = { pushLog, getLogs };
