import { ServerResponse } from 'node:http';
import { CookieOptions, ResponseHeaders } from '@penguin/types';
import cookie from 'cookie';

export class Response {
    private res: ServerResponse;

    constructor(res: ServerResponse) {
        this.res = res;
    }

    json(values: object | any | string): Response {
        values = JSON.stringify(values);
        this.res.write(values);
        return this;
    }

    status(status: number): Response {
        this.res.statusCode = status;
        return this;
    }

    redirect(url: string): Response {
        this.res.statusCode = 302;
        this.res.setHeader('Location', url || '/');
        return this;
    }

    append(
        header: ResponseHeaders,
        value: string | string[] | number | any
    ): Response {
        this.res.setHeader(header, value);
        return this;
    }

    get raw(): ServerResponse {
        return this.res;
    }

    cookie(options: CookieOptions): Response {
        this.res.setHeader(
            'Set-Cookie',
            cookie.serialize(options.name, options.value, {
                ...(options as any),
            })
        );
        return this;
    }

    execute(): Response {
        this.res.end();
        return this;
    }
}
