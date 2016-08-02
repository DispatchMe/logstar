import winston from 'winston';
import 'winston-loggly';
import util from 'util';

const DEFAULT_LOG_LEVEL = 'info';

function parseArgs(args) {
  if (args.length === 1) {
    return args[0];
  }
  return args;
}

export default class Logger {
  constructor(options = {}) {
    this.options = options;

    // Different behavior on client vs server. The presence of winston.Logger
    // denotes being on the server
    if (winston.Logger) {
      this.isServer = true;
      this.initForServer();
    } else {
      this.isServer = false;
    }
  }

  initForServer() {
    const transports = [];

    const {
      logLevel,
      loggly = {},
    } = this.options;

    transports.push(new winston.transports.Console({
      level: logLevel || 'info',
      json: true,
    }));

    // Add loggly transport
    if (loggly.token) {
      transports.push(new winston.transports.Loggly({
        subdomain: loggly.subdomain,
        inputToken: loggly.token,
        level: logLevel || DEFAULT_LOG_LEVEL,
        json: true,
        tags: (loggly.tags || '').split(','),
        stripColors: true,
      }));
    }

    this.winston = new winston.Logger({
      transports,
    });
  }

  getMeta() {
    return this.options.meta;
  }

  log(level, ...args) {
    const meta = this.options.meta || null;
    if (this.isServer) {
      this.winston.log(level, parseArgs(args), meta);
    } else {
      const logLevel = typeof window !== 'undefined' && window.logstarLevel ? window.logstarLevel : this.options.logLevel || DEFAULT_LOG_LEVEL;
      if (logLevel === level) {
        const consoleArgs = args.slice(0); // clone
        if (meta) consoleArgs.push(meta);
        if (console[level]) {
          console[level](`${level}:`, ...consoleArgs);
        } else {
          console.log(`${level}:`, ...consoleArgs);
        }
      }
    }
  }

  logf(level, format, ...args) {
    this.log(level, util.format(format, ...args));
  }
}

const methods = ['debug', 'info', 'warn', 'error', 'fatal'];
methods.forEach(level => {
  Logger.prototype[level] = function(...args) {
    this.log(level, ...args);
  };

  Logger.prototype[`${level}f`] = function(format, ...args) {
    this.logf(level, format, ...args);
  };
});
