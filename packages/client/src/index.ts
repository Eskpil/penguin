import Websocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import axios from 'axios';
import http from 'http';

const ws = new ReconnectingWebSocket('ws://localhost:4000/penguin', [], {
    WebSocket: Websocket,
});

ws.addEventListener('open', () => {
    console.log('Connection opened');
});

const body = {
    opcode: '0',
    operation: 'Project',
    data: {
        body: `
            query Project($name: String!) {
                project(name: $name) {
                    name 
                    repo
                    contributers
                }
            }         
        `,
        variables: {
            name: 'Penguin',
        },
    },
};

const withws = () => {
    ws.send(JSON.stringify(body));
    console.time('wstime');
};

const withRest = async () => {
    console.time('httptime');
    const data = await axios({
        url: 'http://localhost:4000/penguin',
        method: 'POST',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 123',
        },
        withCredentials: true,
    }).then((data) => {
        console.timeEnd('httptime');
        console.log(data.data);
        withws();
    });
};

// withRest();

const httpRestRequest = async () => {
    console.time('time');
    http.get('http://localhost:4000/api/project/Penguin', (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.timeEnd('time');
            console.log(JSON.parse(data));
        });
    });
    // method: 'GET',
    //     url: 'http://localhost:4000/api/project/Penguin',
    // }).then(({ data }) => {
    //     console.timeEnd('time');
    //     console.log(data);
    // });
};

httpRestRequest();

const customWsEvent = () => {
    ws.addEventListener('open', () => {
        console.log('handshake');

        ws.send(JSON.stringify({ e: 'uwu', data: { jesus: 'christ' } }));
    });
};

// customWsEvent();

ws.addEventListener('message', (result) => {
    console.timeEnd('wstime');
    console.log(JSON.parse(result.data));
});
