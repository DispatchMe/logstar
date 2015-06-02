dispatch:logstar
================

#### API

* `Logstar.log`
* `Logstar.info`
* `Logstar.error`
* `Logstar.warn`
* `Logstar.critical`
* `Logstar.allow`
* `Logstar.addMethod`

Example:
```js
    Logstar.log('Hello', 12, { foo: 'bar' }, [1, 2, 3], new Error('Hello'));
```

#### Configuration
*`Meteor.settings`*
```
  "loggly": {
    "token": "********",
    "tags": ["foo"],
    "subdomain": "logstar"
  }
```

#### Allowing clients to log
```js
    Logstar.allow({
      log: function(userId) {
        // Allow all clients to log
        return true;
      }
    });
```

#### Add additional tags
```js
    Logstar.addMethod('foo');
```

#### Support
This logger currently supports:
* loggly

#### Note
When running on `localhost` it will log to local terminal while debugging and developing - If you want to disable this feature do:
```js
    Logstar.isLocal = false;
```