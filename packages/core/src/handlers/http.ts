import { GraphQLSchema } from 'graphql';
import { Server } from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { getMetadataStorage } from '@penguin/metadata';
import { Util } from '../utils/request';
import { Request } from '../models/request';
import { Response } from '../models/response';
import { Shared } from './shared';
import { Logger } from '../utils/logger';
import { GetParamOrder } from '../helpers/params.helpers';

export const METHOD = {
    GET: 'get',
    POST: 'post',
    DELETE: 'delete',
    PUT: 'put',
    OPTIONS: 'options',
    PATCH: 'patch',
    ALL: 'all',
};

interface Options {
    server: Server;
    path?: string;
    schema?: GraphQLSchema;
    context: Function;
    prefix?: string;
}

export class HttpRequestHandler {
    private modules = getMetadataStorage().getBuiltModuleMetadata();
    private server: Server;
    private schema: GraphQLSchema;
    private context: Function;
    private path: string;
    private prefix: string;
    private routes: {
        [key: string]: {
            methodName: string;
            parent: string;
            reg: RegExp;
            path: string;
            param: string[];
        }[];
    } = {};

    private cache: {
        [key: string]: any;
    } = {};

    constructor(options: Options) {
        for (const i in METHOD) {
            this.routes[(METHOD as any)[i]] = [];
        }
        this.server = options.server;
        if (options.schema) {
            this.schema = options.schema;
        }
        if (options.path) {
            this.path = options.path;
        }
        if (options.prefix) {
            this.prefix = options.prefix;
        }
        this.context = options.context;
    }

    init() {
        for (const module of this.modules) {
            const routes = getMetadataStorage().getGroupRouteMetadata(
                module.name
            );
            for (const route of routes) {
                this.routes[route.method].push({
                    methodName: route.methodName,
                    reg: Util.pathToReg(
                        this.prefix,
                        module.pack.prefix,
                        route.endpoint
                    ),
                    path: Util.pathJoin(
                        this.prefix,
                        module.pack.prefix,
                        route.endpoint
                    ).replace(/:(\w+)/g, '{$1}'),
                    param: (route.endpoint.match(/:\w+/g) || []).map((a) =>
                        a.substr(1)
                    ),
                    parent: module.name,
                });
            }
        }
        this.handle();
    }

    private handle() {
        this.server.on(
            'request',
            async (req: IncomingMessage, res: ServerResponse) => {
                const start = process.hrtime();
                const request = new Request(req);
                const response = new Response(res);

                if (
                    req.url === this.path &&
                    req.method?.toLocaleLowerCase() === 'post'
                ) {
                    const body = await request.rawbody();

                    const payload = Shared.params(body);

                    const executed = await Shared.graphql({
                        data: payload,
                        request: request,
                        response: response,
                        schema: this.schema,
                        cache: this.cache,
                        context: this.context,
                    });

                    response.json(executed);

                    const end = process.hrtime(start);

                    Logger.success({
                        method: 'GraphQL',
                        endpoint: 'hello',
                        time: (end[0] * 1e9 + end[1]) / 1e6,
                    });

                    return response.execute();
                } else {
                    const match = this.find(req);
                    if (match.map && match.m) {
                        const module = this.modules.find(
                            (m) => m.name === match.map.parent
                        );

                        if (request.method !== 'GET') {
                            const body = await request.rawbody();
                            request.body = body;
                        }

                        if (match.map.param.length > 0) {
                            const params: {
                                [key: string]: string;
                            } = {};

                            let count = 1;
                            match.map.param.forEach((p: string) => {
                                params[p] = match.m[count];
                                count++;
                            });

                            request.params = params;
                        }

                        const contextPayload: any = {
                            res: response,
                            req: request,
                        };

                        const name = match.map.methodName;

                        const unsortedParams = getMetadataStorage().getGroupMethodMetadata(
                            name,
                            module!.name,
                            'combined'
                        );

                        const sortedParams = GetParamOrder(
                            {
                                context: this.context(contextPayload),
                            },
                            unsortedParams
                        );

                        // @ts-ignore
                        const result = await module.module[name].apply(
                            module!.module,
                            sortedParams
                        );
                        const end = process.hrtime(start);

                        Logger.success({
                            method: req.method!,
                            endpoint: match.map.path,
                            time: (end[0] * 1e9 + end[1]) / 1e6,
                        });

                        if (result) {
                            response.json(result);
                        }
                        return response.execute();
                    } else {
                        response.status(404);
                        response.json({
                            error: {
                                path: 'http',
                                endpoint: `${req.url}`,
                                message: 'Endpoint does not exist.',
                            },
                            iat: new Date().getTime(),
                        });
                        return response.execute();
                    }
                }
            }
        );
    }

    private find(req: any): any | void {
        const method = req.method.toLowerCase();
        for (const i in this.routes[method]) {
            const m = req.url.match(this.routes[method][i].reg);
            if (m) {
                const matches = [];
                for (let i = 0; i < m.length; i++) {
                    matches[i] = decodeURIComponent(m[i]);
                }
                return { m: matches, map: this.routes[method][i] };
            }
        }
        return { m: null, map: null };
    }
}
