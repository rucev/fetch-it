export interface Header {
    name: string;
    value: string;
}

export interface ResponseToDisplay {
    headers: Header[];
    body: string | object | undefined;
    statusCode: number;
    statusMsg: string;
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export interface Options {
    url: string;
    headers?: Header[] | undefined;
    method: HTTPMethod;
    body?: any
}

