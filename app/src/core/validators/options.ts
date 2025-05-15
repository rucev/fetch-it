import type { BodyTypeOptions, Header, HTTPMethod, Options } from '../interfaces.ts'


export const isValidHeader = (header: Header): boolean => {
    return (
        typeof header.name === 'string' &&
        header.name.trim().length > 0 &&
        typeof header.value === 'string' &&
        header.value.trim().length > 0
    )
}

export const areValidHeaders = (headers: Header[] | null | undefined): boolean => {
    if (!headers) return true
    if (!Array.isArray(headers)) return false

    return headers.every(isValidHeader)
}

export const isValidHttpUrl = (url: string): boolean => {
    if (/^https?:\/\/.+/.test(url) || /^http?:\/\/.+/.test(url)) return true
    else return false
}

export const isValidBody = (body: any, type: BodyTypeOptions | undefined): boolean => {
    const text = typeof body === 'string' ? body.trim() : ''

    if (body === undefined) return true

    try {
        switch (type) {
            case 'json':
                if (typeof body === 'object') return true
                JSON.parse(text)
                return true
            case 'xml':
                return /^<.+>/.test(text)
            case 'text':
                return true
            default:
                return false
        }
    } catch {
        return false
    }
}


export const isValidOptions = (options: Options): boolean => {
    const methods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
    return (
        isValidHttpUrl(options.url) &&
        methods.includes(options.method) &&
        areValidHeaders(options.headers) &&
        isValidBody(options.body?.content, options.body?.type)
    )
}

