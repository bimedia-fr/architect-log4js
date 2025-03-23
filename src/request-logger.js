const util = require('util');

/**
 * Check wether arg is a function.
 * @param {Function} fn object to test
 * @returns {Boolean} true if fn is a function
 */
function isFunc(fn) {
    return typeof fn === 'function';
}

/**
 * Capitalize first letter of argument.
 * @param {String} str string to capitalize.
 * @returns {String} capitalized string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Logger levels
 * @type {Array<String>}
 */
const LEVELS = ['info', 'debug', 'warn', 'trace', 'error'];

/**
 * 
 * @param {Object} items 
 * @param {import('log4js').Logger} log 
 * @param {*} def 
 * @returns 
 */
function wrap(items, log, def) {
    return items.reduce(function (prev, curr) {
        var existing = prev[curr] && isFunc(prev[curr]);
        if (!existing) {
            prev[curr] = isFunc(def) ? def(curr) : def;
        }
        return prev;
    }, log);
}

/**
 * 
 * @param {Object} log 
 * @param {function(String): function} def 
 * @returns 
 */
function wrapLoggers(log, def) {
    return wrap(LEVELS, log, def);
}

/**
 * 
 * @param {import('log4js').Logger} log
 * @param {*} def 
 * @returns 
 */
function wrapEnabled(log, def) {
    return wrap(LEVELS.map(function (level) {
        return 'is' + capitalizeFirst(level) + 'Enabled';
    }), log, def);
}

/**
 * 
 * @param {Object} obj object to pick property from
 * @param {String} ppty property name 
 * @returns {Object} object property value
 */
function getProperty(obj, ppty) {
    const subs = ppty.split('.');
    return subs.reduce(function (prev, curr) {
        if (!prev) {
            return;
        }
        return prev[curr];
    }, obj);
}

/**
 * @typedef {Object} RequestOptions
 * @property {String|function(import('http').IncomingMessage):String} property property name to pick from request
 * @property {String} [format] property output format
 */

/**
 * 
 * @param {RequestOptions} config 
 * @param {import('log4js').Log4js} log4js 
 * @returns {function(import('http').IncomingMessage)}
 */
module.exports = function (config, log4js) {
    const property = config.property || 'url';
    const format = config.format || '[%s] %s';
    return function (req) {
        const ppty = (typeof property === 'function') ? property(req) : getProperty(req, property);
        return {
            /**
             * 
             * @param {String} name logger name
             * @returns {import('log4js').Logger}
             */
            getLogger: function (name) {
                const logger = log4js.getLogger(name);
                const res = wrapLoggers({}, function (level) {
                    return function () {
                        const args = [].slice.apply(arguments);
                        if(typeof args[0] === 'object') {
                            args[0] = util.format(format, ppty, args[0] instanceof Error ? args[0] : JSON.stringify(args[0]));
                        }
                        else {
                            args[0] = util.format(format, ppty, String(args[0]));
                        }
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
