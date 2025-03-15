/**
 * @typedef {Object} Log4jsWithRequest
 * @extends import('log4js').Log4js
 * @property {reqLogger} requestLogger
 */
/**
 * @type Log4jsWithRequest
 * allow to add attribute to base object.
 */
const log4js = require('log4js');
const reqLogger = require('./request-logger');
const { EventEmitter } = require('stream');


/**
 * @typedef {Object} ModuleOptions
 * @property {String} packagePath log4js module path
 * @property {import('log4js').Configuration} config log4js configuration
 * @property {Object} request configure request aware logger
 * @property {String} request.property property name to pick from request
 */

/**
 * @typedef {Object} ModuleExport
 * @property {Log4jsWithRequest} log
 * @property {function():void} onDestroy
 */

/**
 * 
 * @param {ModuleOptions} options 
 * @param {{ hub: EventEmitter; }} imports 
 * @param  {function (Error|null, ModuleExport):void}  register 
 */
module.exports = function (options, imports, register) {
    let hub = imports.hub;
    let config = JSON.parse(JSON.stringify(options.config));


    let fileDateAppenders = Object.keys(config.appenders).filter((a) => config.appenders[a] && config.appenders[a].type === 'dateFile');

    fileDateAppenders.forEach((appenderName) => {
        // ensure defaults
        let appender = config.appenders[appenderName];
        if (appender) {
            appender.pattern = appender.pattern || 'yyyy-MM-dd'
            appender.encoding = appender.encoding || 'utf8';
            appender.mode = appender.mode || 0o644;
            appender.numBackups = appender.numBackups || 90;
            appender.compress = appender.hasOwnProperty('compress') ? appender.compress : true;
            appender.keepFileExt = appender.hasOwnProperty('keepFileExt') ? appender.keepFileExt : true;
            appender.alwaysIncludePattern = appender.hasOwnProperty('alwaysIncludePattern') ? appender.alwaysIncludePattern : false;
            // appender.fileNameSep = appender.fileNameSep || '.';
        }
    });

    log4js.configure(config);
    log4js.requestLogger = reqLogger(options.request || {}, log4js);

    let logger = log4js.getLogger('app');

    if (hub) {
        hub.on('log.error', logger.error.bind(logger));
        hub.on('log.info', logger.info.bind(logger));
    }

    register(null, {
        onDestroy: function destroy() {
            log4js.shutdown(function () {//flush on destroy
                //flushed
            });
        },
        log: log4js
    });
};

module.exports.provides = ['log'];
module.exports.consumes = ['hub'];
