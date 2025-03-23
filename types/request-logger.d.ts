declare namespace _exports {
    export { RequestOptions };
}
declare function _exports(config: RequestOptions, log4js: import("log4js").Log4js): (arg0: import("http").IncomingMessage) => any;
export = _exports;
type RequestOptions = {
    /**
     * property name to pick from request
     */
    property: string | ((arg0: import("http").IncomingMessage) => string);
    /**
     * property output format
     */
    format?: string | undefined;
};
//# sourceMappingURL=request-logger.d.ts.map