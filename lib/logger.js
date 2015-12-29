import winston from 'winston';
import { argumentsToString } from './format';

let winstonLogger = null;
if (winston.Logger) {
  // On the server use winston
  winstonLogger = new winston.Logger({
    transports: [new winston.transports.Console()],
  });

  require('./loggly').addTransport(winstonLogger);
}

function log(level, output) {
  if (winstonLogger) {
    winstonLogger.log(level, output);
  } else {
    const print = `${level}: ${output}`;
    if (console[level]) console[level].apply(console, [print]);
    else console.log(print);
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

export const winstonInstance = winstonLogger;
