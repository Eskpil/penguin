export type RequestHeaders =
    | 'A-Im'
    | 'Accept-Charset'
    | 'Accept-Datetime'
    | 'Accept-Encoding'
    | 'Accept-Language'
    | 'Access-Control-Request-Method'
    | 'Access-Control-Request-Headers'
    | 'Authorization'
    | 'Cache-Control'
    | 'Connection'
    | 'Content-Encoding'
    | 'Content-Length'
    | 'Content-MD5'
    | 'Content-Type'
    | 'Cookie'
    | 'Date'
    | 'Expect'
    | 'Forwarded'
    | 'From'
    | 'Host'
    | 'HTTP2-Settings'
    | 'If-Match'
    | 'If-Modified-Since'
    | 'If-None-Match'
    | 'If-Range'
    | 'If-Unmodified-Since'
    | 'Max-Forwards'
    | 'Origin'
    | 'Pragma'
    | 'Prefer'
    | 'Proxy-Authorization'
    | 'Range'
    | 'Referer'
    | 'TE'
    | 'Trailer'
    | 'Transfer-Encoding'
    | 'User-Agent'
    | 'Upgrade'
    | 'Via'
    | 'Warning'
    | 'X-API-KEY'
    | 'X-TOKEN'
    | 'X-REFRESH-TOKEN'
    | String;

export type HttpMethods =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'HEAD'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE';

export enum Operations {
    query = 0,
    mutation = 1,
    subscription = 2,
    response = 3,
    request = 5,
}
