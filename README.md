logstar
================

[![Travis Status][https://api.travis-ci.org/DispatchMe/logstar.svg]][https://travis-ci.org/DispatchMe/logstar]
[![devDependency Status](https://david-dm.org/dispatchme/logstar/dev-status.svg)](https://david-dm.org/dispatchme/logstar)
[![Dependency Status](https://david-dm.org/dispatchme/logstar.svg)](https://david-dm.org/dispatchme/logstar)

> Simple, opinionated, isomorphic logging.

It uses winston on the server and `console.log` on the client. It supports multiple arguments. If you have LOGGLY environment variables set, it will auto-configure the winston loggly transport.

#### API

* `Logstar.debug`
* `Logstar.info`
* `Logstar.warn`: Prioritize taking action.
* `Logstar.error`: Take action soon.
* `Logstar.fatal`: Take action IMMEDIATELY!!!!
* [SERVER] `Logstar.winstonInstance`

Example:
```js
  import { debug, info, fatal } from 'logstar';
  debug('My mood', ['need', 'more', 'coffee']);
  info({ temperature: -10 });
  fatal('Sound the alarms', { weather: 'hail' }, new Error('Too cold'));
```

```js
  import * as Logstar from 'logstar';
  Logstar.info('Hello', 12, { foo: 'bar' }, [1, 2, 3], new Error('Hello'));
```

#### Configuration
*`ENV VARIABLES`*
```
CONSOLE_LEVEL="debug" # Defaults to info -- if you set this to "false" it will disable console logging (server only)
LOGGLY_LEVEL="debug" # Defaults to info
LOGGLY_SUBDOMAIN="mysubdomain"
LOGGLY_TAGS="api-server,production"
LOGGLY_TOKEN="secret-loggly-token-here"
```
