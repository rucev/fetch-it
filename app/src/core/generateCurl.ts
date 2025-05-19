import type { Options } from '../interfaces/interfaces'
import { isValidOptions } from '../validators/options'

export const generateCurl = (options: Options, isVerbose: boolean): string[] => {
    if (!isValidOptions(options)) throw new Error('Invalid options')

    const cUrlLines: string[] = []

    cUrlLines.push(`curl -X ${options.method} "${options.url}" \\`)

    if (options.headers) {
        options.headers.forEach(header => {
            cUrlLines.push(`-H "${header.name}: ${header.value}" \\`)
        })
    }

    if (options.body && typeof options.body === 'object' && 'type' in options.body && 'content' in options.body) {
        const { type, content } = options.body

        let formattedBody: string | undefined

        switch (type) {
            case 'json':
                try {
                    const json = typeof content === 'string' ? JSON.parse(content) : content
                    formattedBody = JSON.stringify(json)
                } catch {
                    formattedBody = typeof content === 'string' ? content : JSON.stringify(content)
                }
                break

            case 'text':
            case 'xml':
                formattedBody = typeof content === 'string' ? content : String(content)
                break

            default:
                formattedBody = undefined
        }

        if (formattedBody) {
            cUrlLines.push(`-d '${formattedBody}' \\`)
        }
    }

    const lastIndex = cUrlLines.length - 1
    cUrlLines[lastIndex] = cUrlLines[lastIndex].replace(/\\$/, '')

    if (isVerbose) {
        cUrlLines[lastIndex] += ' -v'
    }

    return cUrlLines
}
