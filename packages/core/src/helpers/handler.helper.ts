import { Request, Response, Socket } from '@penguin/common';
import {
    DocumentNode,
    GraphQLError,
    GraphQLSchema,
    parse,
    Source,
    validate,
    specifiedRules,
} from 'graphql';
import { CompiledQuery, compileQuery } from 'graphql-jit';
import LRU from 'tiny-lru';
import { SchemaGenerator } from '@penguin/graphql';

interface ErrorCacheValue {
    document: DocumentNode;
    validationErrors: readonly GraphQLError[];
}

interface CacheValue extends ErrorCacheValue {
    jit: CompiledQuery;
}

interface Payload {
    variables?: any;
    query: any;
    operationName?: string;
    id?: string;
}

interface Options {
    req?: Request;
    res?: Response;
    socket?: Socket;
    payload: Payload;
}

export class HandlerHelper {
    private cache = LRU<CompiledQuery>(1024);
    private schema: GraphQLSchema = new SchemaGenerator().build();
    context: Function;

    constructor(context: Function) {
        this.context = context;
    }

    async graphql(options: Options) {
        const { query, variables, operationName, id } = options.payload;

        let cached = this.cache.get(query);

        if (!cached) {
            let document;
            const errors = [];
            try {
                document = parse(new Source(query, 'Graphql Request'));
            } catch (err) {
                if (options.res) {
                    options.res
                        .status(400)
                        .json({ errors: err, iat: new Date().getTime() });
                } else {
                    errors.push(err);
                }
            }

            const validationErrors = validate(
                this.schema,
                document as DocumentNode,
                [...specifiedRules]
            );
            if (validationErrors.length > 0) {
                if (options.res) {
                    options.res.status(400).json({
                        errors: validationErrors,
                        iat: new Date().getTime(),
                    });
                } else {
                    errors.push(validationErrors);
                }
            }

            if (errors.length > 0 && options.socket) {
                options.socket.send({
                    id,
                    type: 'error',
                    payload: errors,
                });
            }
            cached = compileQuery(
                this.schema,
                document as DocumentNode,
                operationName
            ) as CompiledQuery;
        }

        const context: any = {};
        if (options.req && options.res) {
            context.res = options.res;
            context.req = options.req;
        } else {
            context.socket = options.socket;
        }

        const result: any = await cached!.query(
            '',
            this.context(context),
            variables
        );

        if (options.res) {
            options.res
                .status(200)
                .json({ data: result.data, errors: result.errors })
                .execute();
        } else {
            options.socket!.send({
                id,
                type: 'next',
                payload: result,
            });
            options.socket!.send({
                id,
                type: 'complete',
            });
        }
    }

    parseSocketParams(payload: any): Payload {
        return {
            id: payload.id,
            query: payload.payload.query,
            operationName: payload.payload.operationName,
            variables: payload.payload.variables,
        };
    }

    parseHttpParams(body: any): Payload {
        return {
            query: body.query,
            operationName: body.operationName,
            variables: body.variables,
        };
    }
}
