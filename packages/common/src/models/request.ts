import { IncomingMessage } from 'http';
import { RequestHeaders } from '../declarations/request';

export class Request {
    body: any;

    headers: {
        [header: string]: RequestHeaders;
    } = {};

    raw: IncomingMessage;

    params: any;
    constructor(req: IncomingMessage, params?: any) {
        this.raw = req;

        if (params) {
            this.params = params;
        }
    }

    get(name: RequestHeaders) {
        return this.headers[name as any];
    }

    get url() {
        return this.raw.url;
    }

    get method(): String {
        return this.raw.method!;
    }

    async buildBody() {
        return new Promise((res, rej) => {
            let dataBuffer = '';
            this.raw.on('data', (chunk) => {
                dataBuffer += chunk;
            });

            this.raw.on('error', (err) => console.log(err));

            this.raw.on('end', () => {
                const decoder = new TextDecoder('utf8');
                const json = JSON.parse(dataBuffer);

                res(json);
            });
        });
    }
}
