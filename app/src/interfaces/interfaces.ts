import type { BodyTypeOptions, HTTPMethod } from "./types";

export interface HeaderRequest {
  name: {
    isCustom: boolean,
    content: string
  };
  value: {
    isCustom: boolean,
    content: string
  };
}

export interface HeaderResponse {
  name: string,
  value: string
}


export interface ResponseToDisplay {
  headers: HeaderResponse[] | undefined
  body: string | object | undefined
  statusCode: number
  statusMsg: string
}

export interface BodyInfo {
  content: string | object | undefined
  type: BodyTypeOptions
}

export interface Options {
  url: string;
  headers?: HeaderRequest[] | undefined
  method: HTTPMethod
  body?: BodyInfo
}

export interface fetchRequest {
  method: HTTPMethod;
  url: string;
  header: HeaderRequest[] | undefined
  body: BodyInfo | undefined
}

export interface fetchResponse {
  status: string
  code: number
  header: HeaderResponse[] | undefined
  body: string | undefined
}

export interface fetchCall {
  name: string
  fetchId: string
  request: fetchRequest
  response: fetchResponse | undefined
}

export interface fetchCollection {
  name: string
  fetchId: string
  calls: string[]
}

export interface fetchCollectionDisplay {
  name: string
  fetchId: string
  calls: fetchCall[]
}