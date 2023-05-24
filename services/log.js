const { createLogger, format, transports, addColors } = require('winston');
const DatadogWinston = require('datadog-winston');
const os = require('os');

const customLevels = {
  levels: {
    info: 3,
    warn: 2,
    error: 1,
    critical: 0,
  },
  colors: {
    info: 'bold cyan',
    warn: 'bold yellow',
    error: 'bold red',
    critical: 'bold white redBG',
  },
};

const consoleFormatter = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.splat(),
  format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message} \n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  }),
);

addColors(customLevels.colors);

const log = createLogger({
  transports: [
    new transports.Console({
      format: consoleFormatter,
      level: 'info',
    }),
    new DatadogWinston({
      apiKey: process.env.DATADOG_API_KEY,
      ddsource: 'nodejs',
      ddtags: `env:development`,
      service: `${process.env.SYMBOL}-crypto-bot`,
      hostname: os.hostname(),
    }),
  ],
  levels: customLevels.levels,
});

module.exports = log;
