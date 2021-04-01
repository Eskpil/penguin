import { RequestHeaders } from '@penguin/types';
import { IncomingMessage } from 'node:http';
import * as BodyParse from 'co-body';
import raw from 'raw-body';
import inflate from 'inflation';

const bodyMap = new Map<Request, object>();

export class Request {
    private req: IncomingMessage;
    private headersObject: {
        [key: string]: string;
    } = {};
    body: any;
    private rawParams: any;

    constructor(req: IncomingMessage) {
        this.req = req;
    }

    public headers(): { [key: string]: string } {
        const keys = Object.entries(this.req.headers);
        keys.forEach((header) => {
            this.headersObject[header[0]] = header[1]?.toString()!;
        });

        // return keys;
        return this.headersObject;
    }

    get raw(): IncomingMessage {
        return this.req;
    }

    header(header: RequestHeaders): string {
        return this.headersObject[header.toLowerCase()];
    }

    get method(): String {
        return this.req.method!;
    }

    set params(params: any) {
        this.rawParams = params;
    }

    get params() {
        return this.rawParams;
    }

    async rawbody() {
        const str = await raw(inflate(this.raw), {
            length: this.header('Content-Length'),
        });
        const body = JSON.parse(str as any);
        return body;
    }
}
