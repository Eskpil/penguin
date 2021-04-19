import { ModuleUtils, Request, Response } from '@penguin/common';
import { Server, createServer, IncomingMessage } from 'http';
import WebSocket, { Server as SocketServer } from 'ws';
import { HttpRequest } from './http';
import { SocketRequest } from './socket';
import { RequestUtils } from './utils/request';
import { SocketUtils } from './utils/socket';

export interface ContextPayload {
    req?: Request;
    res?: Response;
    socket?: any;
}

export const METHODS = {
    GET: 'get',
    POST: 'post',
    DELETE: 'delete',
    PUT: 'put',
    OPTIONS: 'options',
    PATCH: 'patch',
    ALL: 'all',
};

interface Options {
    packages: any[];
    prefix: string;
    context: (params: ContextPayload) => void;
    graphql:
        | boolean
        | {
              path?: string;
          };
}

export class Mount {
    private prefix: string;
    private context: (params: ContextPayload) => void;
    private server: Server;
    private socketServer: SocketServer;
    private path: string;
    private gql: boolean;

    constructor(options: Options) {
        this.prefix = options.prefix;
        this.context = options.context;

        if (options.graphql) {
            this.gql = true;
            if ((options.graphql as any).path) {
                this.path = (options.graphql as any).path;
            } else {
                this.path = '/penguin';
            }
        } else {
            this.gql = false;
        }

        ModuleUtils.buildFromPacks(options.packages);
        for (const i in METHODS) {
            RequestUtils.routes[(METHODS as any)[i]] = [];
        }

        RequestUtils.prefix = this.prefix;
        RequestUtils.build();

        SocketUtils.build();
    }

    listen(port: string | number, cb: Function): Mount {
        this.server = createServer(
            (req, res) =>
                new HttpRequest({
                    ctx: this.context,
                    prefix: this.prefix,
                    path: this.path,
                    req,
                    res,
                    graphql: this.gql,
                })
        );

        this.socketServer = new SocketServer({ noServer: true });

        this.server.on('upgrade', (request: IncomingMessage, socket, head) => {
            if (request.url?.toLowerCase() === this.path) {
                this.socketServer.handleUpgrade(
                    request,
                    socket,
                    head,
                    (ws: WebSocket) => {
                        ws.on('message', (data: any) => {
                            new SocketRequest({
                                socket: ws,
                                context: this.context,
                                gql: this.gql,
                                data,
                            });
                        });
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
