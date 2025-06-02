import { HTTP_STATUS_MESSAGES } from '../constants/httpsStatusMessages'
import type { HeaderResponse, Options, ResponseToDisplay } from '../interfaces/interfaces'
import { isValidOptions } from '../validators/options'

export const formatResponse = async (response: Response): Promise<ResponseToDisplay> => {
  const headers: HeaderResponse[] = []
  response.headers.forEach((value, name) => {
    headers.push({ name, value })
  })

  let body: string | object | undefined
  const contentType = response.headers.get('Content-Type') || ''

  try {
    if (contentType.includes('application/json')) {
      body = await response.json()
    } else {
      body = await response.text()
    }
  } catch {
    body = undefined
  }

  let statusMsg = response.statusText

  if (response.statusText.length === 0) {
    statusMsg = HTTP_STATUS_MESSAGES[response.status]
  }

  return {
    headers,
    body,
    statusCode: response.status,
    statusMsg,
  }
}

export default async (options: Options): Promise<ResponseToDisplay> => {
  if (!isValidOptions(options)) throw new Error('Wrong options setup')

  const url: string = options.url
  const method: string = options.method
  const headers: HeadersInit | undefined = options.headers
    ? Object.fromEntries(options.headers.map(header => [header.name.content, header.value.content]))
    : undefined
  let body: any = undefined

  if (options.body) {
    body = options.body.type === 'json' ? JSON.stringify(options.body.content) : options.body.content
  }

  const res = await fetch(url, {
    method,
    headers,
    body
  })

  const response = await formatResponse(res)

  return response
}