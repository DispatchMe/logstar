'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

require('winston-loggly');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_LOG_LEVEL = 'info';

var Logger = function () {
  function Logger() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Logger);

    this.options = options;

    // Different behavior on client vs server. The presence of winston.Logger
    // denotes being on the server
    if (_winston2.default.Logger) {
      this.isServer = true;
      this.initForServer();
    } else {
      this.isServer = false;
    }
  }

  _createClass(Logger, [{
    key: 'initForServer',
    value: function initForServer() {
      var transports = [];

      var _options = this.options;
      var logLevel = _options.logLevel;
      var _options$loggly = _options.loggly;
      var loggly = _options$loggly === undefined ? {} : _options$loggly;


      transports.push(new _winston2.default.transports.Console({
        level: logLevel || 'info',
        json: true
      }));

      // Add loggly transport
      if (loggly.token) {
        transports.push(new _winston2.default.transports.Loggly({
          subdomain: loggly.subdomain,
          inputToken: loggly.token,
          level: logLevel || DEFAULT_LOG_LEVEL,
          json: true,
          tags: (loggly.tags || '').split(','),
          stripColors: true
        }));
      }

      this.winston = new _winston2.default.Logger({
        transports: transports
      });
    }
  }, {
    key: 'log',
    value: function log(level) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // By convention, meta is the second argument IFF there are only two arguments AND
      // it is an object. OR, if there is exactly one argument and it is an object, that will
      // be the meta, with a blank log message.
      var meta = Object.assign({}, this.options.globalMeta || {});
      var message = void 0;
      if (args.length === 2 && _underscore2.default.isObject(args[1])) {
        meta = Object.assign(meta, args[1]);
        message = args[0];
      } else if (args.length === 1 && _underscore2.default.isObject(args[0])) {
        meta = Object.assign(meta, args[0]);
        message = '';
      } else {
        message = args.shift();
        if (args.length > 0) {
          // Add them to the meta as the "context" key. This will become the "context" key in loggly
          meta = Object.assign(meta, {
            context: args
          });
        }
      }

      if (this.isServer) {
        this.winston.log(level, message, meta);
      } else {
        var logLevel = typeof window !== 'undefined' && window.logstarLevel ? window.logstarLevel : this.options.logLevel || DEFAULT_LOG_LEVEL;
        if (logLevel === level) {
          if (console[level]) {
            console[level](level + ':', message, _util2.default.inspect(meta));
          } else {
            console.log(level + ':', message, _util2.default.inspect(meta));
          }
        }
      }
    }
  }, {
    key: 'logf',
    value: function logf(level, format) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      this.log(level, _util2.default.format.apply(_util2.default, [format].concat(args)));
    }
  }]);

  return Logger;
}();

exports.default = Logger;


var methods = ['debug', 'info', 'warn', 'error', 'fatal'];
methods.forEach(function (level) {
  Logger.prototype[level] = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    this.log.apply(this, [level].concat(args));
  };

  Logger.prototype[level + 'f'] = function (format) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    this.logf.apply(this, [level, format].concat(args));
  };
});