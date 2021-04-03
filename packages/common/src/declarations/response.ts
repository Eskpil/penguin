export interface CookieSettings {
    domain?: string;
    encode?: Function;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    secure?: Boolean;
    signed?: Boolean;
    sameSite?: Boolean | string;
}

export interface CookieOptions {
    name: string;
    value: any;
    settings: CookieSettings;
}

export type ResponseHeaders =
    | "Accept-CH"
    | "Access-Control-Allow-Origin"
    | "Access-Control-Allow-Credentials"
    | "Access-Control-Expose-Headers"
    | "Access-Control-Max-Age"
    | "Access-Control-Allow-Methods"
    | "Access-Control-Allow-Headers"
    | "Accept-Patch"
    | "Accept-Ranges"
    | "Age"
    | "Allow"
    | "Alt-Svc"
    | "Cache-Control"
    | "Connection"
    | "Content-Disposition"
    | "Content-Encoding"
    | "Content-Language"
    | "Content-Length"
    | "Content-Location"
    | "Content-MD5"
    | "Content-Range"
    | "Content-Type"
    | "Date"
    | "Delta-Base"
    | "ETag"
    | "Expires"
    | "IM"
    | "Last-Modified"
    | "Link"
    | "Location"
    | "P3P"
    | "Pragma"
    | "Preference-Applied"
    | "Proxy-Authenticate"
    | "Public-Key-Pins"
    | "Retry-After"
    | "Server"
    | "Set-Cookie"
    | "Strict-Transport-Security"
    | "Trailer"
    | "Transfer-Encoding"
    | "Tk"
    | "Upgrade"
    | "Vary"
    | "Via"
    | "Warning"
    | "WWW-Authenticate"
    | "X-Frame-Options";
