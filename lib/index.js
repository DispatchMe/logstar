import Logger from './Logger';

if (typeof process === 'undefined') window.process = { env: {} };

const { LOGGLY_TOKEN, LOGGLY_TAGS, LOGGLY_SUBDOMAIN } = process.env;

function getDefaultParams() {
  return {
    loggly: {
      token: LOGGLY_TOKEN,
      tags: LOGGLY_TAGS,
      subdomain: LOGGLY_SUBDOMAIN,
    },
  };
}

const defaultLogger = new Logger({
  loggly: {
    token: LOGGLY_TOKEN,
    tags: LOGGLY_TAGS,
    subdomain: LOGGLY_SUBDOMAIN,
  },
});

function transactionLogger(transactionID) {
  return new Logger(Object.assign(getDefaultParams(), {
    meta: {
      transaction_id: transactionID,
    },
  }));
}

export default defaultLogger;

export {
  Logger,
  transactionLogger,
};

// For backward compatibility
export const debug = defaultLogger.debug.bind(defaultLogger);
export const info = defaultLogger.info.bind(defaultLogger);
export const warn = defaultLogger.warn.bind(defaultLogger);
export const error = defaultLogger.error.bind(defaultLogger);
export const fatal = defaultLogger.fatal.bind(defaultLogger);
