/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var util = require('util');

function isFunc(fn) {
    return typeof fn == 'function';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

var LEVELS = ['info', 'debug', 'warn', 'trace', 'error'];

function wrap(items, log, def) {
    return items.reduce(function (prev, curr) {
        var existing = prev[curr] && isFunc(prev[curr]);
        if (!existing) {
            prev[curr] = isFunc(def) ? def(curr) : def;
        }
        return prev;
    }, log);
}

function wrapLoggers(log, def) {
    return wrap(LEVELS, log, def);
}

function wrapEnabled(log, def) {
    return wrap(LEVELS.map(function (level) {
        return 'is' + capitalizeFirst(level) + 'Enabled';
    }), log, def);
}

function getProperty(obj, ppty) {
    var subs = ppty.split('.');
    var val;
    return subs.reduce(function (prev, curr) {
        if (!prev) {
            return;
        }
        return prev[curr];
    }, obj);
}

module.exports = function (config, log4js) {
    var property = config.property || 'url';
    var format = config.format || '[%s] %s';
    return function (req) {
        var ppty = getProperty(req, property);
        return {
            getLogger: function (name) {
                var logger = log4js.getLogger(name);
                var res = wrapLoggers({}, function (level) {
                    return function () {
                        var args = [].slice.apply(arguments);
                        var serial = (typeof args[0] == 'object') ? JSON.stringify : String;
                        args[0] = util.format(format, ppty, serial(args[0]));
                        logger[level].apply(logger, args);
                    };
                });
                return wrapEnabled(res, function (level) {
                    return logger[level].bind(logger);
                });
            }
        };
    };
};
