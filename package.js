Package.describe({
  name: 'dispatch:logstar',
  version: '0.0.3',
  summary: 'Logging for both client and server'
});

Npm.depends({
  'loggly': '1.0.8',
  'colors': '0.6.2'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use(['meteor', 'underscore', 'check']);

  api.addFiles([
    'client.js'
  ], 'client');

  api.addFiles([
    'server.js'
  ], 'server');

  api.export('Logstar');
});
