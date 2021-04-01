import { GraphQLSchema, validateSchema } from 'graphql';
import { createServer, Server } from 'http';
import WebSocket, { Server as WsServer } from 'ws';
import { OrmOptions } from '@penguin/types';
import { IncomingMessage } from 'node:http';
import { Response } from './models/response';
import { WebsocketRequestHandler } from './handlers/websocket';
import { HttpRequestHandler } from './handlers/http';
import { SchemaGenerator } from './schema/create';
import { Module } from './module/module';

interface ContextPayload {
    ws?: WebSocket;
    req?: IncomingMessage;
    res?: Response;
}

interface GraphqlOptions {
    schema?: GraphQLSchema;
    path?: string;
}

interface Options {
    graphql?: GraphqlOptions;
    orm: OrmOptions | boolean;
    app: App;
}

interface App {
    context: (params: ContextPayload) => void;
    prefix: string;
    packages: any[];
}

export class Mount {
    server: Server;
    ws: WsServer;
    private schema: GraphQLSchema;
    private path: string;
    private context: any;
    private orm: OrmOptions | boolean;
    private prefix: string;
    private schemaBuilder: SchemaGenerator;

    constructor(options: Options) {
        if (options.graphql) {
            if (options.graphql.path) {
                this.path = options.graphql.path!;
            } else {
                this.path = '/penguin';
            }
        } else {
            this.path = '/penguin';
        }
        this.context = options.app.context;

        if (options.orm) {
            this.orm = options.orm;
        } else {
            this.orm = false;
        }

        Module.buildFromPacks(options.app.packages);

        this.prefix = options.app.prefix;
    }

    listen(port: number, cb: Function): Mount {
        this.server = createServer();
        this.ws = new WsServer({ noServer: true });

        this.server.on('upgrade', (request: IncomingMessage, socket, head) => {
            if (request.url?.toLowerCase() === this.path) {
                this.ws.handleUpgrade(request, socket, head, (ws) => {
                    this.ws.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        });

        this.server.listen(port);
        this.init();
        cb();
        return this;
    }

    private async init() {
        this.schemaBuilder = new SchemaGenerator();
        this.schema = this.schemaBuilder.build();
        const schemaErrors = validateSchema(this.schema);

        if (schemaErrors.length > 0) {
            throw new Error(schemaErrors.toString());
        }

        new WebsocketRequestHandler({
            schema: this.schema,
            server: this.ws,
            context: this.context,
        }).init();

        new HttpRequestHandler({
            schema: this.schema,
            server: this.server,
            prefix: this.prefix,
            path: this.path,
            context: this.context,
        }).init();
    }

    append(): Mount {
        return this;
    }
}
