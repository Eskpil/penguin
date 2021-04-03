import WebSocket from 'ws';

export class Socket {
    payload: any;
    constructor(private socket: WebSocket, payload: any) {
        this.payload = payload;
    }

    send(values: any): Socket {
        const ready = JSON.stringify(values);
        this.socket.send(ready);
        return this;
    }
}
