declare namespace _exports {
    export { Log4jsWithRequest, ModuleOptions, ModuleExport };
}
declare function _exports(options: ModuleOptions, imports: {
    hub: EventEmitter;
}, register: (arg0: Error | null, arg1: ModuleExport) => void): void;
declare namespace _exports {
    let provides: string[];
    let consumes: string[];
}
export = _exports;
type Log4jsWithRequest = import("log4js").Log4js;
type ModuleOptions = {
    /**
     * log4js module path
     */
    packagePath: string;
    /**
     * log4js configuration
     */
    config: import("log4js").Configuration;
    /**
     * configure request aware logger
     */
    request: {
        property: string;
    };
};
type ModuleExport = {
    log: Log4jsWithRequest;
    onDestroy: () => void;
};
import { EventEmitter } from "events";
//# sourceMappingURL=index.d.ts.map