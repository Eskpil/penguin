import { ServerResponse } from 'http';
import { CookieOptions, ResponseHeaders } from '../declarations/response';
import cookie from 'cookie';
import { Request } from './request';

export class Response {
    private res: ServerResponse;
    private req: Request;

    constructor(res: ServerResponse, req: Request) {
        this.res = res;
        this.req = req;
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

    setCookie(options: CookieOptions): Response {
        this.res.setHeader(
            'Set-Cookie',
            cookie.serialize(options.name, options.value, {
                ...(options as any),
            })
        );
        return this;
    }

    cookie(name: string) {
        const cookies = cookie.parse(this.req.headers['cookie'].toString());

        return cookies[name];
    }

    execute(): Response {
        this.res.end();
        return this;
    }
}
