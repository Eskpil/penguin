import { IncomingMessage, ServerResponse } from 'http';
import { GetParamOrder, Request, Response } from '@penguin/common';
import { HandlerHelper } from '../helpers/handler.helper';
import { getMetadataStorage } from '@penguin/metadata';
import { Util } from '../utils/request';

export const METHOD = {
    GET: 'get',
    POST: 'post',
    DELETE: 'delete',
    PUT: 'put',
    OPTIONS: 'options',
    PATCH: 'patch',
    ALL: 'all',
};

export class HttpDistributer {
    private modules = getMetadataStorage().getBuiltModuleMetadata();
    private handler: HandlerHelper;

    private routes: {
        [key: string]: {
            methodName: string;
            parent: string;
            reg: RegExp;
            path: string;
            param: string[];
        }[];
    } = {};

    private prefix: string;
    private path: string;

    constructor(path: string, prefix: string, helper: HandlerHelper) {
        this.prefix = prefix;
        this.handler = helper;
        this.path = path;
        for (const i in METHOD) {
            this.routes[(METHOD as any)[i]] = [];
        }
        this.build();
    }

    async handle(req: IncomingMessage, res: ServerResponse) {
        const request = new Request(req);
        const response = new Response(res, request);

        if (req.url === this.path) {
            request.body = await request.buildBody();

            const params = this.handler.parseHttpParams(request.body);

            return await this.handler.graphql({
                req: request,
                res: response,
                payload: params,
            });
        }

        const match = this.find(request);
        if (match.map && match.m) {
            const route = match.map;
            const module = this.modules.find((m) => m.name === route!.parent);

            if (route!.param.length > 0) {
                const params: {
                    [key: string]: string;
                } = {};

                let count = 1;
                route!.param.forEach((p: string) => {
                    params[p] = match.m![count];
                    count++;
                });

                request.params = params;
            }

            const contextPayload: any = {
                res: response,
                req: request,
            };

            const name = match.map!.methodName;

            const unsortedParams = getMetadataStorage().getGroupMethodMetadata(
                name,
                module!.name,
                'combined'
            );

            const sortedParams = GetParamOrder(
                {
                    context: this.handler.context(contextPayload),
                },
                unsortedParams
            );

            const result = await module?.module[name].apply(
                module.module,
                sortedParams
            );

            if (result) {
                response.json(result);
            }
            return response.execute();
        }
        return response
            .status(404)
            .json({
                code: 404,
                path: request.url,
                message: 'Route does not exist.',
            })
            .execute();
    }

    async build() {
        for (const module of this.modules) {
            const routes = getMetadataStorage().getGroupRouteMetadata(
                module.name
            );
            if (!routes) return;
            for (const route of routes) {
                this.routes[route.method].push({
                    methodName: route.methodName,
                    reg: Util.pathToReg(
                        this.prefix,
                        module.pack.prefix,
                        route.endpoint
                    ),
                    path: Util.pathJoin([
                        this.prefix,
                        module.pack.prefix,
                        route.endpoint,
                    ]).replace(/:(\w+)/g, '{$1}'),
                    param: (route.endpoint.match(/:\w+/g) || []).map((a) =>
                        a.substr(1)
                    ),
                    parent: module.name,
                });
            }
        }
    }

    private find(
        req: any
    ): {
        m: string[] | null;
        map: {
            methodName: string;
            parent: string;
            reg: RegExp;
            path: string;
            param: string[];
        } | null;
    } {
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
