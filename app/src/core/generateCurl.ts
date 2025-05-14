import type { Options } from './interfaces'
import { isValidOptions } from './validators/options'

export const generateCurl = (options: Options, isVerbose: boolean): string[] => {
    if (!isValidOptions(options)) throw new Error('Invalid options')

    const cUrlLines: string[] = []

    cUrlLines.push(`curl -X ${options.method} "${options.url}" \\`)

    if (options.headers) {
        options.headers.forEach(header => {
            cUrlLines.push(`-H "${header.name}: ${header.value}" \\`)
        })
    }

    if (options.body) {
        const contentTypeHeader = options.headers?.find(header => header.name.toLowerCase() === 'content-type')?.value

        let dataPayload: string

        if (contentTypeHeader?.includes('application/json')) {
            dataPayload = JSON.stringify(options.body)
        } else if (contentTypeHeader?.includes('application/x-www-form-urlencoded')) {
            dataPayload = new URLSearchParams(options.body).toString()
        } else if (contentTypeHeader?.includes('multipart/form-data')) {
            Object.entries(options.body).forEach(([key, value]) => {
                cUrlLines.push(`-F "${key}=${value}"`)
            })
            dataPayload = ''
        } else {
            dataPayload = String(options.body)
        }

        if (dataPayload) {
            cUrlLines.push(`-d '${dataPayload}' \\`)
        }
    }

    const lastIndex = cUrlLines.length - 1;

    cUrlLines[lastIndex] = cUrlLines[lastIndex].slice(0, -2);

    if (isVerbose) {
        cUrlLines[lastIndex] = `${cUrlLines[lastIndex]} -v`
    }

    return cUrlLines
}