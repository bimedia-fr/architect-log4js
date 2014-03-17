/*jslint node : true, nomen: true, plusplus: true, vars: true*/
/*global toString : true*/
"use strict";

var assert = require('assert'), vows = require('vows');

vows.describe('Log4js Achitect Service').addBatch({
    'when requiring a log4js service ' : {
        topic : function () {
            return require('../src/index');
        },
        'it exports a function' : function (log4jsservice) {
            assert.equal(toString.call(log4jsservice), '[object Function]');
        },
        'and then initializing the service' : {
            topic: function (log4jsservice) {
                return log4jsservice({}, {}, this.callback);
            },
            'we get a `log` service' : function (err, services) {
                assert.ok(services.log);
            },
            'on which we call `getLogger`' : {
                topic: function (services) {
                    return services.log.getLogger();
                },
                'we get a new default logger' : function (logger) {
                    assert.ok(logger.info);
                    assert.ok(logger.error);
                    assert.ok(logger.debug);
                }
            }
        }
    }
}).exportTo(module);
