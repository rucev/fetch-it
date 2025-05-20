import type { fetchCall, fetchResponse, Options, ResponseToDisplay } from '../interfaces/interfaces.js'
import { isValidOptions } from '../validators/options.js';

export default class CallMapper {
    static toPersistence(options: Options, res: ResponseToDisplay | undefined): fetchCall {
        if (!isValidOptions(options)) throw new Error('Error mapping call')

        const response: fetchResponse | undefined = !res ? undefined :
            {
                status: res.statusMsg,
                code: res.statusCode,
                header: res.headers,
                body: res.body ? JSON.stringify(res.body) : undefined
            }

        const call: fetchCall = {
            name: `${options.method} ${options.url}`,
            fetchId: crypto.randomUUID(),
            request: {
                method: options.method,
                url: options.url,
                header: options.headers,
                body: options.body ? { content: options.body.content, type: options.body.type } : undefined
            },
            response: response

        }
        return call
    }

    static toDomain(savedCall: fetchCall): [Options, ResponseToDisplay | undefined, { name: string, fetchId: string }] {
        const options: Options = {
            url: savedCall.request.url,
            method: savedCall.request.method,
            headers: savedCall.request.header,
            body: savedCall.request.body
        }

        const response: ResponseToDisplay | undefined =
            savedCall.response ? {
                statusMsg: savedCall.response.status,
                statusCode: savedCall.response.code,
                headers: savedCall.response.header,
                body: savedCall.response.body ? JSON.parse(savedCall.response.body) : undefined
            } : undefined

        const fetchCallData = { name: savedCall.name, fetchId: savedCall.fetchId }

        return [options, response, fetchCallData]
    }
}