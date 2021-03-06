import { createLogger, transports, format } from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import util from 'util';
import _ from 'underscore';

const DEFAULT_LOG_LEVEL = 'info';

export default class Logger {
  constructor(options = {}) {
    this.options = options;

    // Different behavior on client vs server. The presence of createLogger
    // denotes being on the server
    if (createLogger) {
      this.isServer = true;
      this.initForServer();
    } else {
      this.isServer = false;
    }
  }

  initForServer() {
    const configuredTransports = [];

    const {
      logLevel,
      loggly = {},
    } = this.options;

    this.consoleTransport = new transports.Console({
      level: logLevel || 'info',
    });
    configuredTransports.push(this.consoleTransport);

    // Add loggly transport
    if (loggly.token) {
      this.logglyTransport = new Loggly({
        subdomain: loggly.subdomain,
        token: loggly.token,
        level: logLevel || DEFAULT_LOG_LEVEL,
        json: true,
        tags: (loggly.tags || '').split(','),
        stripColors: true,
      });
      configuredTransports.push(this.logglyTransport);
    }

    this.winston = createLogger({
      format: format.json(),
      transports: configuredTransports,
    });
  }

  log(level, ...args) {
    // By convention, meta is the second argument IFF there are only two arguments AND
    // it is an object. OR, if there is exactly one argument and it is an object, that will
    // be the meta, with a blank log message.
    let meta = { ...this.options.globalMeta || {} };
    let message;
    if (args.length === 2 && _.isObject(args[1])) {
      meta = Object.assign(meta, args[1]);
      [message] = args;
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

  logf(level, logFormat, ...args) {
    this.log(level, util.format(logFormat, ...args));
  }
}

// Dynamically add new functions to the Logger class which all call in inner log/logf function
const methods = ['debug', 'info', 'warn', 'error', 'fatal'];
methods.forEach((level) => {
  // eslint-disable-next-line func-names
  Logger.prototype[level] = function (...args) {
    this.log(level, ...args);
  };

  // eslint-disable-next-line func-names
  Logger.prototype[`${level}f`] = function (logFormat, ...args) {
    this.logf(level, logFormat, ...args);
  };
});
