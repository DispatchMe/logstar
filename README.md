logstar
================

[![Travis Status](https://api.travis-ci.org/DispatchMe/logstar.svg)](https://travis-ci.org/DispatchMe/logstar)
[![devDependency Status](https://david-dm.org/dispatchme/logstar/dev-status.svg)](https://david-dm.org/dispatchme/logstar)
[![Dependency Status](https://david-dm.org/dispatchme/logstar.svg)](https://david-dm.org/dispatchme/logstar)

> Simple, opinionated, isomorphic logging.

It uses winston on the server and `console.log` on the client. It supports multiple arguments. If you have LOGGLY environment variables set, it will auto-configure the winston loggly transport.

## Usage
```javascript
import * as Logstar from 'logstar';

Logstar.debug('foo');
Logstar.info('bar');
Logstar.fatal('error', new Error('error'));
```

## API

### `class Logger`
```javascript
import { Logger } from 'logstar';
```

#### `constructor(options = {})`
Configure loggly here. Optionally provide `meta` to be attached to each log request.

```javascript
{
  logLevel: 'info',
  loggly: {
    token: '',
    subdomain: '',
    tags: '',
  },
  meta: {}
}
```
#### `debug(...args)`
#### `debugf(format, ...args)`
#### `info(...args)`
#### `infof(format, ...args)`
#### `warn(...args)`
#### `warnf(format, ...args)`
#### `error(...args)`
#### `errorf(format, ...args)`
#### `fatal(...args)`
#### `fatalf(format, ...args)`

### `transactionLogger`
Get a logger that adds a `transaction_id` property to the meta. Useful for tracking related requests.

```javascript
import { transactionLogger } from 'logstar';
const myLogger = transactionLogger('TRANSACTION-ID');
```

### `default`
Logger pre-configured with loggly parameters from environment variables. (See below)

```javascript
import Logstar from 'logstar';

Logstar.info('Hello', 12, { foo: 'bar' }, [1, 2, 3], new Error('Hello'));
```

## Configuration
*`ENV VARIABLES`*
```
LOG_LEVEL="debug" # Defaults to info
LOGGLY_SUBDOMAIN="mysubdomain"
LOGGLY_TAGS="api-server,production"
LOGGLY_TOKEN="secret-loggly-token-here"
```
