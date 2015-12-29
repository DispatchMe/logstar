import { argumentsToString } from './format';

// On the server use winston
let winstonLogger = null;
if (typeof window === 'undefined') {
  const winston = require('winston');

  winstonLogger = new winston.Logger({
    transports: [new winston.transports.Console()],
  });

  require('./loggly').addTransport(winstonLogger);
}

function log(level, output) {
  if (winstonLogger) {
    winstonLogger.log(level, output);
  } else {
    console.log(`${level}: ${output}`); // eslint-disable-line no-console
  }
}

function logger(level) {
  return (...args) => {
    log(level, argumentsToString(args));
  };
}

export const debug = logger('debug');
export const info = logger('info');
export const warn = logger('warn');
export const error = logger('error');
export const fatal = logger('fatal');
