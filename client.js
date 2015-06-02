/* global Logstar: true */

Logstar = {};


/**
 * Add a log method / tag
 * @param {String} tag   Name of tag
 */
Logstar.addMethod = function(tag) {

  Logstar[tag] = function(/* arguments */) {

    Meteor.apply('logstar/' + tag, _.toArray(arguments), function(err, message) {
      if (err) {
        console.error(err.message);
      } else {
        // Print to local console when running on localhost
        if (typeof console[tag] === 'function') {
          // Use the supported console log tag
          console[tag]('[LOGSTAR]', message);
        } else {
          // If tag is not supported then use regular log
          console.log('[LOGSTAR]', message);
        }
      }
    });

  };

};

_.each([
  'log',
  'info',
  'error',
  'warn',
  'critical'
], function(tag) {

  // Add client-side default api
  Logstar.addMethod(tag);

});
