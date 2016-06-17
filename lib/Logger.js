import winston from 'winston';
import 'winston-loggly';
import util from 'util';


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
      this.initForClient();
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
        level: logLevel || 'info',
        json: true,
        tags: (loggly.tags || '').split(','),
      }));
    }

    this.winston = new winston.Logger({
      transports,
    });
  }

  getMeta() {
    return this.options.meta;
  }

  log(level, message) {
    const meta = this.options.meta || null;
    if (this.isServer) {
      this.winston.log(level, message, meta);
    } else {
      const msg = `${level}: ${message}`;
      if (console[level]) {
        console[level](msg, meta);
      } else {
        console.log(msg, meta);
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
    this.log(level, parseArgs(args));
  };

  Logger.prototype[`${level}f`] = function(format, ...args) {
    this.logf(level, format, ...args);
  };
});
