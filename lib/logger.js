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
      formatter: options => {
        let print = `${options.level}: ${options.message}`;

        // Print all of the metadata except the tags property
        if (options.meta) {
          const excludedTags = options.meta.tags;
          delete options.meta.tags;
          print += argumentsToString(options.meta);
          if (excludedTags) options.meta.tags = excludedTags;
        }

        return print;
      },
    }));
  }

  winstonLogger = new winston.Logger({
    transports,
  });

  require('./loggly').addTransport(winstonLogger);
}

let metaTags = [];

function log(level, output) {
  if (winstonLogger) {
    winstonLogger.log(level, output, { meta: { tags: metaTags } });
  } else {
    const print = `${level}: ${output}`;
    if (console[level]) console[level](print); // eslint-disable-line no-console
    else console.log(print); // eslint-disable-line no-console
  }
}

function logger(level) {
  return function(...args) { // eslint-disable-line func-names
    log(level, argumentsToString(args));
  };
}

// Include these tags in the server logs
export function tags(...args) {
  metaTags = args;
}

export const debug = logger('debug');
export const info = logger('info');
export const warn = logger('warn');
export const error = logger('error');
export const fatal = logger('fatal');

export const winstonInstance = winstonLogger;
