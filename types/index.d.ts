declare namespace _exports {
    export { Log4js, Logger, Configuration, RequestOptions, RequestLogger, RequestLoggerFactory, Log4jsWithRequest, ModuleOptions, ModuleExport };
}
declare function _exports(options: ModuleOptions, imports: {
    hub: EventEmitter;
}, register: (arg0: Error | null, arg1: ModuleExport) => void): void;
declare namespace _exports {
    let provides: string[];
    let consumes: string[];
}
export = _exports;
type Log4js = import("log4js").Log4js;
type Logger = import("log4js").Logger;
type Configuration = import("log4js").Configuration;
type RequestOptions = import("./request-logger").RequestOptions;
type RequestLogger = import("./request-logger").RequestLogger;
type RequestLoggerFactory = import("./request-logger").RequestLoggerFactory;
type Log4jsWithRequest = Log4js & {
    requestLogger: RequestLoggerFactory;
};
type ModuleOptions = {
    /**
     * log4js module path
     */
    packagePath: string;
    /**
     * log4js configuration
     */
    config: Configuration;
    /**
     * configure request aware logger
     */
    request?: reqLogger.RequestOptions | undefined;
};
type ModuleExport = {
    log: Log4jsWithRequest;
    onDestroy: () => void;
};
import { EventEmitter } from "events";
import reqLogger = require("./request-logger");
//# sourceMappingURL=index.d.ts.map