import winston from 'winston';
import { argumentsToString } from './format';

let winstonLogger = null;
if (winston.Logger) {
  // On the server use winston

  const transports = [];

  const { CONSOLE_LEVEL } = process.env;
  if (CONSOLE_LEVEL !== 'false' && CONSOLE_LEVEL !== 'FALSE') {
    transports.push(new winston.transports.Console({
      level: CONSOLE_LEVEL || 'info',
    }));
  }

  winstonLogger = new winston.Logger({
    transports,
  });

  require('./loggly').addTransport(winstonLogger);
}

function log(level, output) {
  if (winstonLogger) {
    winstonLogger.log(level, output);
  } else {
    const print = `${level}: ${output}`;
    if (console[level]) console[level](print); // eslint-disable-line no-console
    else console.log(print); // eslint-disable-line no-console
  }
}

let logger = {};

function logFunc(level) {
  return function(...args) { // eslint-disable-line func-names
    log(level, argumentsToString(args));

    // Allow chaining
    return logger;
  };
}

logger = {
  debug: logFunc('debug'),
  info: logFunc('info'),
  warn: logFunc('warn'),
  error: logFunc('error'),
  fatal: logFunc('fatal'),
  winstonInstance: winstonLogger,
};

module.exports = logger;
