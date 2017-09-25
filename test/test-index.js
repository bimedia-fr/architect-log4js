/*jslint node : true, nomen: true, plusplus: true, vars: true*/
/*global toString : true*/
"use strict";

var assert = require('assert'), vows = require('vows'), events = require('events');

var emitter = new events.EventEmitter();
vows.describe('Log4js Achitect Service').addBatch({
    'when requiring a log4js service ' : {
        topic : function () {
            return require('../src/index');
        },
        'it exports a function' : function (log4jsservice) {
            assert.isFunction(log4jsservice);
        },
        'and then initializing the service' : {
            topic: function (log4jsservice) {
                return log4jsservice({
                    config: {
                        appenders: { console: { type: 'console' }},
                        categories: {
                            default: { appenders: ['console'], level: 'trace' }
                        }
                    }
                }, { hub: emitter }, this.callback);
            },
            'we get a `log` service' : function (err, services) {
                assert.ifError(err);
                assert.ok(services.log);
            },
            'on which we call `getLogger`' : {
                topic: function (services) {
                    emitter.emit('log.info', 'information message');
                    return services.log.getLogger();
                },
                'we get a new default logger' : function (logger) {
                    assert.ok(logger.info);
                    assert.ok(logger.error);
                    assert.ok(logger.debug);
                    logger.info('logger is working');
                }
            }
        }
    }
}).exportTo(module);
