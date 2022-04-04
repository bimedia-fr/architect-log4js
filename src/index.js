const log4js = require('log4js');
const reqLogger = require('./request-logger');


/**
 * 
 * @param {{ config: string; request: any; }} options 
 * @param {{ hub: any; }} imports 
 * @param  {(arg0: null, arg1: { onDestroy: () => void; log: typeof log4js; }) => void}  register 
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
            appender.mode = appender.mode || '0o644';
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
