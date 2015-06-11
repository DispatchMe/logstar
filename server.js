/* global Logstar: true */

Logstar = {};

var loggly = Npm.require('loggly');
var colors = Npm.require('colors');
var logglyClient;

Logstar.isLocal = /:\/\/localhost:/.test(Meteor.absoluteUrl());

if (Logstar.isLocal) {
  console.info('[Logstar]'.yellow, 'Running on localhost');
}

if (Meteor.settings.loggly) {

  // Check that we have a token, subdomain and optional array of tags
  check(Meteor.settings.loggly.token, String);
  check(Meteor.settings.loggly.tags, Match.Optional([String]));
  check(Meteor.settings.loggly.subdomain, String);

  // Create the loggly client
  logglyClient = loggly.createClient({
    token: Meteor.settings.loggly.token,
    tags: Meteor.settings.loggly.tags,
    subdomain: Meteor.settings.loggly.subdomain
  });

  console.log('[Logstar]'.green, 'Connecting to loggly');

}

var _argumentsToString = function(args) {
  var result = [];

  _.each(args, function(arg) {
    // If argument is a string the push it right in
    if (arg === ''+arg) {
      result.push(arg);
    } else if (arg instanceof Error) {
      // Push the string version of the Error message
      result.push(arg.toString());
    } else {
      // else create a json version of the argument
      // note: This will fail if circular references are used
      result.push(JSON.stringify(arg));
    }
  });

  return result.join(' ');
};

var allowRules = {};

/**
 * Add a log method / tag
 * @param {String} tag   Name of tag
 * @param {Color} color Optional color
 */
Logstar.addMethod = function(tag, color) {

  var meteorMethod = {};

  // Set default color
  color = color || colors.white;

  Logstar[tag] = function(/* arguments */) {

    // Convert the arguments into one nice string
    var message = _argumentsToString(_.toArray(arguments));

    if (logglyClient && !Logstar.isLocal) {
      // If tag is critical it's implying that its a critical error
      var tags = (tag === 'critical')? [tag, 'error']:[tag];
      // If loggly supported log a message using the tag "log"
      logglyClient.log(message, tags, function(err) {
        if (err) {
          console.error('[LOGSTAR-CLIENT]'.red, err);

          // Print to local console when running on localhost
          if (typeof console[tag] === 'function') {
            // Use the supported console log tag
            console[tag](color('[LOGSTAR]'), message);
          } else {
            // If tag is not supported then use regular log
            console.log(color('[LOGSTAR]'), message);
          }
        }
      });
    } else {
      // Print to local console when running on localhost
      if (typeof console[tag] === 'function') {
        // Use the supported console log tag
        console[tag](color('[LOGSTAR]'), message);
      } else {
        // If tag is not supported then use regular log
        console.log(color('[LOGSTAR]'), message);
      }
    }

    return message;

  };

  // Rig ddp method for client-side logging
  meteorMethod['logstar/' + tag] = function(/* arguments */) {
    if (typeof allowRules[tag] === 'function' && allowRules[tag](this.userId)) {
      // Log message for client
      return Logstar[tag].apply(this, _.toArray(arguments));
    } else {
      // Throw an error, user is not allowed to log messages
      throw new Meteor.Error('Access denied, user not authorized for logging');
    }
  };

  Meteor.methods(meteorMethod);
};

// Rig default methods / tags
_.each({
  'log': colors.blue,
  'info': colors.green,
  'error': colors.red,
  'warn': colors.yellow,
  'critical': colors.underline.red
}, function(color, tag) {

  // Add method
  Logstar.addMethod(tag, color);

});


/**
 * Allow rules for logging
 * @param  {Object} options Object of rules "{ log: function(userId) { return true; } }"
 */
Logstar.allow = function(options) {
  _.extend(allowRules, options);
};
