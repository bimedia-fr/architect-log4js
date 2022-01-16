const log4js = require('log4js');
const reqLogger = require('./request-logger');


/**
 * 
 * @param {{ config: string; request: any; }} options 
 * @param {{ hub: any; }} imports 
 * @param  {(arg0: null, arg1: { onDestroy: () => void; log: typeof log4js; }) => void}  register 
 */
module.exports = function (options, imports, register) {
    var hub = imports.hub;

    if (options.config) {
        log4js.configure(options.config);
    }

    log4js.requestLogger = reqLogger(options.request || {}, log4js);

    var logger = log4js.getLogger('app');

    if (hub) {
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
