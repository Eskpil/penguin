import { GraphQLSchema, parse, specifiedRules, validate } from 'graphql';
import { compileQuery } from 'graphql-jit';
import { Request } from '../models/request';
import { Response } from '../models/response';
import WebSocket from 'ws';

export interface RequestPayload {
    operation: string;
    body: string;
    opcode: string | undefined;
    variables: {
        [key: string]: string;
    };
}

interface GraphqlOptions {
    data: RequestPayload;
    schema: GraphQLSchema;
    cache: any;
    context: Function;
    websocket?: WebSocket;
    request?: Request;
    response?: Response;
}

interface Context {
    ws?: WebSocket;
    req?: Request;
    res?: Response;
}

export abstract class Shared {
    static async graphql(options: GraphqlOptions) {
        return new Promise(async (res, rej) => {
            const documentAST = parse(options.data.body);

            const validationErrors = validate(options.schema, documentAST, [
                ...specifiedRules,
            ]);

            if (validationErrors.length > 0) {
                return res({
                    iat: new Date().getTime(),
                    errors: validationErrors,
                });
            }

            const contextPayload: Context = {};

            if (options.request && options.response) {
                contextPayload.req = options.request;
                contextPayload.res = options.response;
            } else if (options.websocket) {
                contextPayload.ws = options.websocket;
            }

            if (!(options.data.body in options.cache)) {
                options.cache[options.data.body] = compileQuery(
                    options.schema,
                    documentAST,
                    options.data.operation,
                    {
                        customJSONSerializer: true,
                    }
                );
            }

            const result = await options.cache[options.data.body].query(
                '',
                options.context(contextPayload),
                options.data.variables
            );

            res(
                result.errors
                    ? {
                          iat: new Date().getTime(),
                          errors: result.errors,
                      }
                    : result
            );
        });
    }

    static params(payload: any) {
        let opcode;
        let operation;
        let body;
        let variables;

        if (payload.query) {
            const tempOperataion = payload.query.split(' ')[0];
            switch (tempOperataion) {
                case 'query':
                    opcode = 0;
                    break;
                case 'mutation':
                    opcode = 1;
                    break;
                case 'subscription':
                    opcode = 2;
                    break;
                default:
                    opcode = 0;
                    break;
            }

            body = payload.query;
            operation = payload.operation;
            variables = payload.variables;
        } else {
            opcode = payload.opcode;
            operation = payload.operation;
            body = payload.data.body;
            variables = payload.data.variables;
        }

        return { operation, body, variables, opcode };
    }
}
