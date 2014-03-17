/*jslint node : true, nomen: true, plusplus: true, vars: true*/
"use strict";

var log4js = require('log4js');

module.exports = function (options, imports, register) {
    if (options.config) {
        log4js.configure(options.config);
    }
    register(null, {log: log4js});
};
