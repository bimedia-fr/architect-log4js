declare namespace _exports {
    export { RequestOptions, RequestLogger, RequestLoggerFactory };
}
declare function _exports(config: RequestOptions, log4js: import("log4js").Log4js): RequestLoggerFactory;
export = _exports;
type RequestOptions = {
    /**
     * property name to pick from request
     */
    property?: string | ((arg0: import("http").IncomingMessage) => string) | undefined;
    /**
     * property output format
     */
    format?: string | undefined;
};
type RequestLogger = {
    getLogger: (arg0: string) => import("log4js").Logger;
};
type RequestLoggerFactory = (arg0: import("http").IncomingMessage) => RequestLogger;
//# sourceMappingURL=request-logger.d.ts.map