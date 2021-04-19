import { IncomingMessage } from 'http';
import { RequestHeaders } from '../declarations/request';

export class Request {
    body: any;

    headers: {
        [header: string]: string;
    } = {};

    raw: IncomingMessage;

    params: {
        [param: string]: string;
    };

    constructor(req: IncomingMessage) {
        this.raw = req;
    }

    get(name: RequestHeaders) {
        return this.headers[name as any];
    }

    public buildHeaders(): { [key: string]: string } {
        const keys = Object.entries(this.raw.headers);
        keys.forEach((header) => {
            this.headers[header[0]] = header[1]?.toString()!;
        });

        // return keys;
        return this.headers;
    }

    get url() {
        return this.raw.url;
    }

    get method(): String {
        return this.raw.method!;
    }

    async buildBody(cb?: (body: any) => void) {
        return new Promise((res, rej) => {
            let dataBuffer = '';
            this.raw.on('data', (chunk) => {
                dataBuffer += chunk;
            });

            this.raw.on('error', (err) => console.log(err));

            this.raw.on('end', () => {
                const decoder = new TextDecoder('utf8');
                if (
                    this.headers['Content-Type'] === 'application/json' ||
                    this.headers['content-type'] === 'application/json'
                ) {
                    const json = JSON.parse(dataBuffer);
                    if (cb) {
                        cb(json);
                        res(json);
                    } else {
                        res(json);
                    }
                }
            });
        });
    }
}
