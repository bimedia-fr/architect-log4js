/*jslint node : true, nomen: true, plusplus: true, vars: true*/
"use strict";

var log4js = require('log4js');
var reqLogger = require('./request-logger');

module.exports = function (options, imports, register) {
    var hub = imports.hub;

    if (options.config) {
        log4js.configure(options.config);
    }

    log4js.requestLogger = reqLogger(options.request || {}, log4js);

    var logger = log4js.getLogger('app');

    hub.on('log.error', logger.error.bind(logger));
    hub.on('log.info', logger.info.bind(logger));

    register(null, {
        onDestroy: function destroy() {
            log4js.shutdown(function () {//flush on destroy
                //flushed
            });
        },
        log: log4js
    });
};

module.exports.provides = ['log'];
module.exports.consumes = ['hub'];
