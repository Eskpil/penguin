import WebSocket from 'ws';
import { ContextPayload } from './mount';
import { getMetadataStorage } from '@penguin/metadata';
import { GetParamOrder, Socket } from '@penguin/common';
import { worker } from 'cluster';
import { SocketUtils } from './utils/socket';

interface Options {
    socket: WebSocket;
    gql: boolean;
    context: (params: ContextPayload) => void;
    data: any;
}

export class SocketRequest {
    private socket: Socket;
    private modules = getMetadataStorage().getBuiltModuleMetadata();
    private context: (params: ContextPayload) => void;
    private gql: boolean;

    constructor(options: Options) {
        const payload = JSON.parse(options.data as string);
        this.gql = options.gql;
        this.context = options.context;
        this.socket = new Socket(options.socket, payload);

        if (this.socket.payload.type) {
            this.graphql();
        } else {
        }
    }

    async event() {
        const eventName = this.socket.payload.event;
        const data = this.socket.payload.data;
        if (eventName in SocketUtils.events) {
            const event = SocketUtils.events[eventName];
            const module = this.modules.find((m) => m.name === event.parent);
            const unsortedParams = getMetadataStorage().getGroupMethodMetadata(
                event.methodName,
                event.parent,
                'combined'
            );
            this.socket.payload = data;
            const sortedParams = GetParamOrder(
                {
                    context: this.context({ socket: this.socket }),
                },
                unsortedParams
            );

            const result = await module?.module[event.methodName].apply(
                module,
                sortedParams
            );
            if (result) {
                this.socket.send(result);
            }
        } else {
            this.socket.send({
                code: 404,
                iat: new Date().getTime(),
                message: 'Event does not exist.',
            });
        }
    }

    async graphql() {
        // @ts-ignore
        const { GraphQLExecuter } = await import('@penguin/graphql');

        const executor = new GraphQLExecuter(this.context);
        const payload = executor.parseSocketParams(this.socket.payload);
        switch (this.socket.payload.type) {
            case 'subscribe': {
                return await executor.graphql({ payload, socket: this.socket });
            }
            case 'connection_init': {
                this.socket.send({
                    type: 'connection_ack',
                    payload: {
                        handshake: new Date().getTime(),
                        pid: process.pid,
                        worker: worker.id,
                    },
                });
            }
        }

        return executor.graphql({ payload, socket: this.socket });
    }
}
