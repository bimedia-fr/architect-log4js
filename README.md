architect-log4js
================

Expose [log4js](https://github.com/nomiddlename/log4js-node) as architect service.

### Installation

```sh
npm install --save architect-log4js
```
### Config Format
```js
{
  "packagePath": "architect-log4js",
  "config": {
    "appenders": [
        { "type": "console" }
    ],
    "replaceConsole": true
  }
}
```

### Usage

Boot [Architect](https://github.com/c9/architect) :

```js
var path = require('path');
var architect = require("architect");

var configPath = path.join(__dirname, "config.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
    if (err) {
        throw err;
    }
    //app.services.log is avaliable now
    var log = app.services.log.getLogger('app');
    log.info('application started');
});
```

Configure Log4js Architect service with `config.js` :

```js
module.exports = [{
    packagePath: "architect-log4js",
    config: {
      appenders: [
        { type: "console" }
      ],
      replaceConsole: true
    }
}, './routes'];
```
`config` object is passed to `log4js.configure` method. See [log4js configuration](https://github.com/nomiddlename/log4js-node#configuration) for more options.


Consume *log* service in your application :

```js
{
  "name": "routes",
  "version": "0.0.1",
  "main": "index.js",
  "private": true,

  "plugin": {
    "consumes": ["log"]
  }
}
```

Eventually use the `log` service in your app :

```js
module.exports = function setup(options, imports, register) {
    var logger = imports.log.getLogger(); //get default logger
    log.info('plugin initialized.');
    register();
};
```
