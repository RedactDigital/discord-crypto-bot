const { createLogger, format, transports, addColors } = require('winston');
const path = require('path');

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
  format.printf(info => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message} \n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

const logFormatter = format.combine(
  // Only difference between this and console is color is removed
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.splat(),
  format.printf(info => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message} \n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

addColors(customLevels.colors);

const devLogger = createLogger({
  transports: new transports.Console({
    format: consoleFormatter,
    level: 'info',
  }),
  levels: customLevels.levels,
});

const prodLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../storage/logs/info.log'),
      level: 'info',
      format: logFormatter,
    }),
    new transports.File({
      filename: path.join(__dirname, '../storage/logs/error.log'),
      level: 'warn',
      format: logFormatter,
    }),
  ],
  levels: customLevels.levels,
});

let log = {};

if (process.env.NODE_ENV !== 'production') log = devLogger;

if (process.env.NODE_ENV === 'production') log = prodLogger;

module.exports = log;
