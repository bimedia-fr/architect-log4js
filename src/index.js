/*jslint node : true, nomen: true, plusplus: true, vars: true*/
"use strict";

var log4js = require('log4js');

module.exports = function (options, imports, register) {
    var hub = imports.hub;

    if (options.config) {
        log4js.configure(options.config);
    }

    var logger = log4js.getLogger('app');

    hub.on('log.error', logger.error.bind(logger));
    hub.on('log.info', logger.info.bind(logger));

    register(null, {log: log4js});
};

module.exports.provides = ['log'];
module.exports.consumes = ['hub'];
