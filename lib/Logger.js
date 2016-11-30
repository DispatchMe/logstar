import winston from 'winston';
import 'winston-loggly-bulk';
import util from 'util';
import _ from 'underscore';

const DEFAULT_LOG_LEVEL = 'info';

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

  log(level, ...args) {
    // By convention, meta is the second argument IFF there are only two arguments AND
    // it is an object. OR, if there is exactly one argument and it is an object, that will
    // be the meta, with a blank log message.
    let meta = Object.assign({}, this.options.globalMeta || {});
    let message;
    if (args.length === 2 && _.isObject(args[1])) {
      meta = Object.assign(meta, args[1]);
      message = args[0];
    } else if (args.length === 1 && _.isObject(args[0])) {
      meta = Object.assign(meta, args[0]);
      message = '';
    } else {
      message = args.shift();
      if (args.length > 0) {
        // Add them to the meta as the "context" key. This will become the "context" key in loggly
        meta = Object.assign(meta, {
          context: args,
        });
      }
    }

    if (this.isServer) {
      this.winston.log(level, message, meta);
    } else {
      const logLevel = typeof window !== 'undefined' && window.logstarLevel ? window.logstarLevel : this.options.logLevel || DEFAULT_LOG_LEVEL;
      if (logLevel === level) {
        if (console[level]) {
          console[level](`${level}:`, message, util.inspect(meta));
        } else {
          console.log(`${level}:`, message, util.inspect(meta));
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
