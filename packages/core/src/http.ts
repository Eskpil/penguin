import { IncomingMessage, ServerResponse } from 'http';
import { GetParamOrder, Request, Response } from '@penguin/common';
import { RequestUtils } from './utils/request';
import { getMetadataStorage } from '@penguin/metadata';
import { ContextPayload } from './mount';

interface Options {
    path: string;
    prefix: string;
    ctx: (params: ContextPayload) => void;
    req: IncomingMessage;
    res: ServerResponse;
    graphql: boolean;
}

export class HttpRequest {
    private modules = getMetadataStorage().getBuiltModuleMetadata();

    private path: string;
    private ctx: (params: ContextPayload) => void;
    private gql: boolean;

    private req: Request;
    private res: Response;

    constructor(options: Options) {
        this.path = options.path;
        this.ctx = options.ctx;
        this.gql = options.graphql;

        this.req = new Request(options.req);
        this.res = new Response(options.res, this.req);

        this.req.buildHeaders();

        if (this.req.method === 'GET') {
            if (this.gql && this.req.url === this.path) {
                this.render();
            } else {
                this.rest();
            }
        } else {
            this.req.buildBody(async (body) => {
                this.req.body = body;
                if (this.gql && options.req.url === this.path) {
                    await this.graphql();
                } else {
                    await this.rest();
                }
            });
        }
    }

    private async render() {
        // @ts-ignore
        const { render } = await import('@penguin/graphql');
        return render(this.res, this.req);
    }

    private async graphql() {
        // @ts-ignore
        const { GraphQLExecuter } = await import('@penguin/graphql');
        const executer = new GraphQLExecuter(this.ctx);

        const params = executer.parseHttpParams(this.req.body);

        return await executer.graphql({
            req: this.req,
            res: this.res,
            payload: params,
        });
    }
    private async rest() {
        const match = RequestUtils.find(this.req);
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

                this.req.params = params;
            }

            const contextPayload: any = {
                res: this.req,
                req: this.req,
            };

            const name = match.map!.methodName;

            const unsortedParams = getMetadataStorage().getGroupMethodMetadata(
                name,
                module!.name,
                'combined'
            );

            const sortedParams = GetParamOrder(
                {
                    context: this.ctx(contextPayload),
                },
                unsortedParams
            );

            const result = await module?.module[name].apply(
                module.module,
                sortedParams
            );

            if (result) {
                this.res.json(result);
            }

            this.res.status(200);

            return this.res.execute();
        }
        return this.res
            .status(404)
            .json({
                code: 404,
                path: this.req.url,
                message: 'Route does not exist.',
            })
            .execute();
    }
}
