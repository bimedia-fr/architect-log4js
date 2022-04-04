
var assert = require('assert');
var events = require('events');
var mock = require('mock-require');
var log4jsservice  = require('../src/index');

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
    describe('requiring a log4js service ', function() {
        it('should export a function', function (done) {
            assert.ok(log4jsservice);
            assert.ok(typeof log4jsservice == 'function')
            done();
        });
    });
    describe('initializing the service', function() {
        var log;
        it('should get a `log` service', function(done) {
            log4jsservice(CONFIG, { hub: emitter }, function (err, services) {
                assert.ifError(err);
                assert.ok(services.log);
                log = services.log
                done();
            });
        });
        it('should expose a getLogger method', function(done) {
            emitter.emit('log.info', 'information message');
            var logger = log.getLogger();
            assert.ok(logger.info);
            assert.ok(logger.error);
            assert.ok(logger.debug);
            logger.info('logger is working');
            done();
        });
    });
});
