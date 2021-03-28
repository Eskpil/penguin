import { BaseModule } from '../module';
import { Server } from 'ws';
import { RequestPayload, Shared } from './shared';
import { GraphQLSchema } from 'graphql';
import { getMetadataStorage } from '../metadata/getMetadata';

interface Options {
    modules: {
        prefix: string;
        name: string;
        module: BaseModule;
    }[];
    server: Server;
    schema?: GraphQLSchema;
    context: Function;
}

export class WebsocketRequestHandler {
    private modules: {
        [key: string]: {
            prefix: string;
            name: string;
            module: BaseModule;
        };
    } = {};
    private server: Server;
    private schema: GraphQLSchema;
    private context: Function;

    private events: {
        [key: string]: {
            name: string;
            parent: string;
            methodName: string;
        };
    } = {};

    private cache: {
        [key: string]: any;
    } = {};

    constructor(options: Options) {
        for (const module of options.modules) {
            this.modules[module.name] = { ...module };
        }
        this.server = options.server;
        if (options.schema) {
            this.schema = options.schema;
        }
        this.context = options.context;
    }

    async init() {
        const modules = Object.entries(this.modules);
        for (const module of modules) {
            const events = getMetadataStorage().getGroupEventMetadata(
                module[1].name
            );
            for (const event of events) {
                this.events[event.name] = {
                    ...event,
                };
            }
        }

        this.server.on('connection', (websocket) => {
            websocket.on('message', async (payload: any) => {
                const body = JSON.parse(payload);

                if (body.opcode && this.schema) {
                    const data: RequestPayload = Shared.params(body);

                    const response = await Shared.graphql({
                        data,
                        schema: this.schema,
                        cache: this.cache,
                        context: this.context,
                        websocket,
                    });

                    return websocket.send(JSON.stringify(response));
                }

                const eventname = body.e;

                if (eventname in this.events) {
                    const event = this.events[eventname];
                    const module = this.modules[event.parent];

                    // @ts-ignore
                    const execute = await module.module[event.methodName]({
                        websocket,
                        data: body.data,
                    });

                    if (execute) {
                        websocket.send(JSON.stringify(websocket));
                    }
                } else {
                    return websocket.send(
                        JSON.stringify({
                            code: 404,
                            error: 'Event does not exist.',
                            iat: new Date().getTime(),
                        })
                    );
                }
            });
        });
    }
}
