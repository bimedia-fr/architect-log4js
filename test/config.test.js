
var assert = require('assert');
var events = require('events');
var mock = require('mock-require');
let service = require('../src/index');

var emitter = new events.EventEmitter();

describe('Log4js Achitect Service', function() {
    describe('initializing the service', function() {
        it('should set default config on appenders', function(done) {
            mock('log4js', {
                configure: function (config){
                    // console.log(config);
                    assert.strictEqual(config.appenders.app.pattern, 'yyyy-MM-dd');
                    assert.strictEqual(config.appenders.app.mode, '0o644');
                    assert.strictEqual(config.appenders.app.numBackups, 90);
                },
                getLogger: function() {
                    return console;
                }
            });
            let log4jsservice  = mock.reRequire('../src/index');
            let conf = {
                config: {
                    appenders: {
                        app: {
                            type: 'dateFile',
                            filename: '/var/log/service/file.log'
                        }
                    },
                    categories: {
                        default: {appenders: ['app'], level: 'info'}
                    }
                }
            };
            log4jsservice(conf, { hub: emitter }, function (err, services) {
                assert.ifError(err);
                assert.ok(services.log);
                done();
            });
        });
        it('should keep specified config on appenders', function(done) {
            mock('log4js', {
                configure: function (config){
                    // console.log(config);
                    assert.strictEqual(config.appenders.app.pattern, 'yyyy-MM-dd');
                    assert.strictEqual(config.appenders.app.mode, '0o644');
                    assert.strictEqual(config.appenders.app.numBackups, 30);
                },
                getLogger: function() {
                    return console;
                }
            });
            let log4jsservice  = mock.reRequire('../src/index')
            let conf = {
                config: {
                    appenders: {
                        app: {
                            type: 'dateFile',
                            filename: '/var/log/service/file.log',
                            numBackups: 30
                        }
                    },
                    categories: {
                        default: {appenders: ['app'], level: 'info'}
                    }
                }
            };
            log4jsservice(conf, { hub: emitter }, function (err, services) {
                assert.ifError(err);
                assert.ok(services.log);
                done();
            });
        });
    });
});
