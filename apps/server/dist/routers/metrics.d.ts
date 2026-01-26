export declare const metricsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        res: import("express").Response<any, Record<string, any>>;
        user: {
            id: string;
            role: string;
        };
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    ingest: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
                user: {
                    id: string;
                    role: string;
                };
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            user: {
                id: string;
                role: string;
            };
        };
        _input_in: {
            cpu: {
                load: number;
                cores: number[];
            };
            memory: {
                total: number;
                used: number;
                free: number;
                percent: number;
            };
            uptime: number;
            timestamp: string | Date;
            disk?: {
                used: number;
                fs: string;
                size: number;
                usePercent: number;
                mount: string;
            }[] | undefined;
            network?: {
                iface: string;
                rx_bytes: number;
                tx_bytes: number;
                operstate: string;
            }[] | undefined;
        };
        _input_out: {
            cpu: {
                load: number;
                cores: number[];
            };
            memory: {
                total: number;
                used: number;
                free: number;
                percent: number;
            };
            uptime: number;
            timestamp: string | Date;
            disk?: {
                used: number;
                fs: string;
                size: number;
                usePercent: number;
                mount: string;
            }[] | undefined;
            network?: {
                iface: string;
                rx_bytes: number;
                tx_bytes: number;
                operstate: string;
            }[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
    }>;
    getSystemMetrics: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
                user: {
                    id: string;
                    role: string;
                };
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            user: {
                id: string;
                role: string;
            };
        };
        _input_in: {
            deviceId?: string | undefined;
            timeRange?: "1h" | "24h" | "7d" | undefined;
        };
        _input_out: {
            timeRange: "1h" | "24h" | "7d";
            deviceId?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        timestamp: string;
        cpu: number;
        memory: number;
    }[]>;
    getInterfaceMetrics: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
                user: {
                    id: string;
                    role: string;
                };
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            user: {
                id: string;
                role: string;
            };
        };
        _input_in: {
            deviceIp: string;
            interfaceIndex: number;
            timeRange?: "1h" | "24h" | "7d" | "1m" | undefined;
        };
        _input_out: {
            timeRange: "1h" | "24h" | "7d" | "1m";
            deviceIp: string;
            interfaceIndex: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        timestamp: string;
        bytesIn: number;
        bytesOut: number;
    }[]>;
}>;
