
var assert = require('assert');
var events = require('events');
var mock = require('mock-require');
let service = require('../src/index');

var emitter = new events.EventEmitter();
const CONFIG = {
    config: {
        appenders: { console: { type: 'console' } },
        categories: {
            default: { appenders: ['console'], level: 'trace' }
        }
    }
};

describe('Log4js Achitect Service', function() {
    describe('shutting down the service', function() {
        it('should call log4js shutdown', function(done) {
            mock('log4js', {
                configure: function (config){
                },
                getLogger: function() {
                    return console;
                },
                shutdown: function() {
                    assert.ok(true);
                    done();
                }
            });
            let log4jsservice  = mock.reRequire('../src/index');

            log4jsservice(CONFIG, { hub: emitter }, function (err, services) {
                assert.ifError(err);
                assert.ok(services.log);
                services.onDestroy()
            });
        });
    });
});
