import { GraphQLSchema, validateSchema } from 'graphql';
import { createServer, Server } from 'http';
import WebSocket, { Server as WsServer } from 'ws';
import { OrmOptions } from '@penguin/types';
import { IncomingMessage } from 'node:http';
import { Response } from './models/response';
import { BaseModule } from './module';
import { WebsocketRequestHandler } from './handlers/websocket';
import { getMetadataStorage } from './metadata/getMetadata';
import { HttpRequestHandler } from './handlers/http';
import { SchemaGenerator } from './schema/create';

interface ContextPayload {
    ws?: WebSocket;
    req?: IncomingMessage;
    res?: Response;
}

interface GraphqlOptions {
    rootValue?: string;
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
    private rootValue: string;
    private orm: OrmOptions | boolean;
    private modules: {
        [key: string]: {
            name: string;
            prefix: string;
            module: BaseModule;
        };
    } = {};
    private prefix: string;
    private schemaBuilder: SchemaGenerator;

    constructor(options: Options) {
        if (options.graphql) {
            if (options.graphql.rootValue) {
                this.rootValue = options.graphql.rootValue;
            }
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

        for (const rawpack of options.app.packages) {
            const pack = new rawpack();
            const packageMetadata = getMetadataStorage()
                .getPackageMetadata()
                .find((p) => p.name === rawpack.name.toLowerCase());

            if (!packageMetadata) {
                throw new Error(
                    `Package: ${rawpack.name} is not registered in metadata.`
                );
            }

            for (const rawmodule of packageMetadata.imports) {
                const module = new rawmodule();
                const metadata = getMetadataStorage().getSingleModuleMetadata(
                    rawmodule.name
                );
                if (!metadata) {
                    throw new Error(
                        `Module: ${rawmodule.name} is not registered in metadata.`
                    );
                }
                this.modules[metadata.name] = {
                    module,
                    prefix: packageMetadata.prefix,
                    name: metadata.name,
                };
            }
        }

        this.prefix = options.app.prefix;

        this.schemaBuilder = new SchemaGenerator({
            modules: Object.entries(this.modules).map((m) => {
                return {
                    prefix: m[1].prefix,
                    module: m[1].module,
                    name: m[1].name,
                };
            }),
        });
        this.schema = this.schemaBuilder.build();
        const schemaErrors = validateSchema(this.schema);

        if (schemaErrors.length > 0) {
            throw new Error(schemaErrors.toString());
        }
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
        new WebsocketRequestHandler({
            schema: this.schema,
            server: this.ws,
            context: this.context,
            modules: Object.entries(this.modules).map((m) => {
                return {
                    prefix: m[1].prefix,
                    module: m[1].module,
                    name: m[1].name,
                };
            }),
        }).init();
        new HttpRequestHandler({
            schema: this.schema,
            server: this.server,
            prefix: this.prefix,
            modules: Object.entries(this.modules).map((m) => {
                return {
                    prefix: m[1].prefix,
                    module: m[1].module,
                    name: m[1].name,
                };
            }),
            path: this.path,
            context: this.context,
        }).init();
    }

    append() {}
}
