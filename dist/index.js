'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fatal = exports.error = exports.warn = exports.info = exports.debug = exports.transactionLogger = exports.Logger = undefined;

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof process === 'undefined') window.process = { env: {} };

var _process$env = process.env;
var LOGGLY_TOKEN = _process$env.LOGGLY_TOKEN;
var LOGGLY_TAGS = _process$env.LOGGLY_TAGS;
var LOGGLY_SUBDOMAIN = _process$env.LOGGLY_SUBDOMAIN;


function getDefaultParams() {
  return {
    loggly: {
      token: LOGGLY_TOKEN,
      tags: LOGGLY_TAGS,
      subdomain: LOGGLY_SUBDOMAIN
    }
  };
}

var defaultLogger = new _Logger2.default({
  loggly: {
    token: LOGGLY_TOKEN,
    tags: LOGGLY_TAGS,
    subdomain: LOGGLY_SUBDOMAIN
  }
});

function transactionLogger(transactionID) {
  return new _Logger2.default(Object.assign(getDefaultParams(), {
    globalMeta: {
      transaction_id: transactionID
    }
  }));
}

exports.default = defaultLogger;
exports.Logger = _Logger2.default;
exports.transactionLogger = transactionLogger;

// For backward compatibility

var debug = exports.debug = defaultLogger.debug.bind(defaultLogger);
var info = exports.info = defaultLogger.info.bind(defaultLogger);
var warn = exports.warn = defaultLogger.warn.bind(defaultLogger);
var error = exports.error = defaultLogger.error.bind(defaultLogger);
var fatal = exports.fatal = defaultLogger.fatal.bind(defaultLogger);