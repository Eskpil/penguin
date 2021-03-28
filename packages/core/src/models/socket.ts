import WebSocket from 'isomorphic-ws';
import { Socket as NetSocket } from 'net';

export class Socket {
    private socket: WebSocket;

    constructor(websocket: WebSocket) {
        this.socket = websocket;
    }

    async send(payload: unknown) {
        this.socket.send(JSON.stringify(payload));
    }
}
