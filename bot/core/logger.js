const levels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  debug: 'DEBUG',
};

function format(level, message, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${levels[level]}] ${message}`;
  if (!meta) return base;
  return `${base} ${JSON.stringify(meta)}`;
}

module.exports = {
  info(message, meta) {
    console.log(format('info', message, meta));
  },
  warn(message, meta) {
    console.warn(format('warn', message, meta));
  },
  error(message, meta) {
    console.error(format('error', message, meta));
  },
  debug(message, meta) {
    if (String(process.env.DEBUG).toLowerCase() === 'true') {
      console.log(format('debug', message, meta));
    }
  },
};
