import type { BodyTypeOptions, HTTPMethod } from "./types";

export interface Header {
    name: string;
    value: string;
}

export interface ResponseToDisplay {
    headers: Header[] | undefined;
    body: string | object | undefined;
    statusCode: number;
    statusMsg: string;
}

export interface BodyInfo {
    content: string | object | undefined;
    type: BodyTypeOptions;
}

export interface Options {
    url: string;
    headers?: Header[] | undefined;
    method: HTTPMethod;
    body?: BodyInfo
}

export interface fetchRequest {
    method: HTTPMethod;
    url: string;
    header: Header[] | undefined
    body: BodyInfo | undefined
}

export interface fetchResponse {
    status: string;
    code: number;
    header: Header[] | undefined;
    body: string | undefined
}

export interface fetchCall {
    name: string,
    fetchId: string,
    request: fetchRequest;
    response: fetchResponse | undefined;
}