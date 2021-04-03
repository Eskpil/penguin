import { ModuleUtils, Request, Response } from '@penguin/common';
import { Server, createServer, IncomingMessage } from 'http';
import WebSocket, { Server as SocketServer } from 'ws';
import { HttpDistributer } from './handlers/http.distrubuter';
import { SocketDistributer } from './handlers/socket.distrubuter';
import { HandlerHelper } from './helpers/handler.helper';

interface ContextPayload {
    req: Request;
    res: Response;
    socket: any;
}

interface Options {
    graphql?: {
        path?: string;
    };
    app: {
        packages: any[];
        prefix: string;
        context: (params: ContextPayload) => void;
    };
}

export class Mount {
    private prefix: string;
    private context: (params: ContextPayload) => void;
    private server: Server;
    private socketServer: SocketServer;
    private path: string;

    constructor(options: Options) {
        this.prefix = options.app.prefix;
        this.context = options.app.context;

        if (options.graphql) {
            if (options.graphql.path) {
                this.path = options.graphql.path;
            } else {
                this.path = '/penguin';
            }
        } else {
            this.path = '/penguin';
        }

        ModuleUtils.buildFromPacks(options.app.packages);
    }

    listen(port: string | number, cb: Function): Mount {
        const helper = new HandlerHelper(this.context);
        const httpDistributer = new HttpDistributer(
            this.path,
            this.prefix,
            helper
        );

        this.server = createServer((req, res) =>
            httpDistributer.handle(req, res)
        );
        this.socketServer = new SocketServer({ noServer: true });

        this.server.on('upgrade', (request: IncomingMessage, socket, head) => {
            if (request.url?.toLowerCase() === this.path) {
                this.socketServer.handleUpgrade(
                    request,
                    socket,
                    head,
                    (ws: WebSocket) => {
                        new SocketDistributer().init(ws, helper);
                    }
                );
            } else {
                socket.destroy();
            }
        });
        this.server.listen(typeof port === 'string' ? parseInt(port) : port);
        cb({ server: this.server, socket: this.socketServer });
        return this;
    }
}
