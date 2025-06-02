import type { HeaderRequest, Options } from '../interfaces/interfaces'
import type { HTTPMethod, BodyTypeOptions } from '../interfaces/types'


export const isValidHeader = (header: HeaderRequest): boolean => {
  return (
    typeof header.name.content === 'string' &&
    header.name.content.trim().length > 0 &&
    typeof header.value.content === 'string' &&
    header.value.content.trim().length > 0
  )
}

export const areValidHeaders = (headers: HeaderRequest[] | null | undefined): boolean => {
  if (!headers) return true
  if (!Array.isArray(headers)) return false

  return headers.every(isValidHeader)
}

const isValidSimpleUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const isValidHttpUrl = (url: string): boolean => {
  if (!isValidSimpleUrl(url)) return false
  if (/^https?:\/\/.+/.test(url) || /^http?:\/\/.+/.test(url)) return true
  else return false
}

export const doesMethodAcceptBody = (method: HTTPMethod): boolean => {
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return false
  else return true
}

export const isValidBody = (body: any, type: BodyTypeOptions | undefined, method: HTTPMethod | undefined): boolean => {
  const text = typeof body === 'string' ? body.trim() : ''

  if (body === undefined) return true
  if (method && !doesMethodAcceptBody(method)) return false

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
    isValidBody(options.body?.content, options.body?.type, options.method)
  )
}

