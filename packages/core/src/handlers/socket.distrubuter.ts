import { BaseModule, GetParamOrder, Socket } from '@penguin/common';
import { getMetadataStorage } from '@penguin/metadata';
import WebSocket from 'ws';
import { HandlerHelper } from '../helpers/handler.helper';

export class SocketDistributer {
    private helper: HandlerHelper;
    private modules = getMetadataStorage().getBuiltModuleMetadata();
    private events: {
        [key: string]: {
            name: string;
            parent: string;
            methodName: string;
        };
    } = {};

    async init(websocket: WebSocket, helper: HandlerHelper) {
        this.helper = helper;

        websocket.on('message', async (data) => {
            const payload = JSON.parse(data as string);
            const socket = new Socket(websocket, payload);

            if (socket.payload.type) {
                this.graphql(socket);
            } else {
                const eventName = payload.event;
                const data = payload.data;
                if (eventName in this.events) {
                    const event = this.events[eventName];
                    const module = this.modules.find(
                        (m) => m.name === event.parent
                    );
                    const unsortedParams = getMetadataStorage().getGroupMethodMetadata(
                        event.methodName,
                        event.parent,
                        'combined'
                    );
                    socket.payload = data;
                    const sortedParams = GetParamOrder(
                        {
                            context: helper.context({ socket }),
                        },
                        unsortedParams
                    );

                    const result = await module?.module[event.methodName].apply(
                        module,
                        sortedParams
                    );
                    if (result) {
                        socket.send(result);
                    }
                } else {
                    socket.send({
                        code: 404,
                        iat: new Date().getTime(),
                        message: 'Event does not exist.',
                    });
                }
            }
        });
    }

    graphql(socket: Socket) {
        const payload = this.helper.parseSocketParams(socket.payload);
        switch (socket.payload.type) {
            case 'subscribe': {
                return this.helper.graphql({ payload, socket });
            }
            case 'connection_init': {
                socket.send({
                    type: 'connection_ack',
                    payload: {
                        handshake: new Date().getTime(),
                    },
                });
            }
        }

        return this.helper.graphql({ payload, socket });
    }

    build() {
        for (const module of this.modules) {
            const events = getMetadataStorage().getGroupEventMetadata(
                module.name
            );
            for (const event of events) {
                this.events[event.name] = {
                    ...event,
                };
            }
        }
    }
}
