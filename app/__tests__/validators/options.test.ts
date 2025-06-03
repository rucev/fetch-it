import { describe, it, expect } from 'vitest'
import { isValidHeader, areValidHeaders, isValidHttpUrl, doesMethodAcceptBody, isValidBody, isValidOptions } from '../../src/validators/options'
import type { HeaderRequest, Options } from '../../src/interfaces/interfaces'

describe('isValidHeader', () => {
  it('returns true for valid header', () => {
    const header: HeaderRequest = {
      name: { content: 'Content-Type', isCustom: false },
      value: { content: 'application/json', isCustom: false }
    }
    expect(isValidHeader(header)).toBe(true)
  })

  it('returns false for empty name', () => {
    const header: HeaderRequest = {
      name: { content: '', isCustom: false },
      value: { content: 'value', isCustom: false }
    }
    expect(isValidHeader(header)).toBe(false)
  })
})

describe('areValidHeaders', () => {
  it('returns true for null or undefined', () => {
    expect(areValidHeaders(null)).toBe(true)
    expect(areValidHeaders(undefined)).toBe(true)
  })

  it('returns false for non-array', () => {
    expect(areValidHeaders({} as any)).toBe(false)
  })

  it('returns true for all valid headers', () => {
    const headers: HeaderRequest[] = [
      {
        name: { content: 'X-Test', isCustom: false },
        value: { content: '123', isCustom: false }
      }
    ]
    expect(areValidHeaders(headers)).toBe(true)
  })

  it('returns false if any header is invalid', () => {
    const headers: HeaderRequest[] = [
      {
        name: { content: '', isCustom: false },
        value: { content: '123', isCustom: false }
      }
    ]
    expect(areValidHeaders(headers)).toBe(false)
  })
})

describe('isValidHttpUrl', () => {
  it('returns true for http or https urls', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true)
    expect(isValidHttpUrl('http://example.com')).toBe(true)
  })

  it('returns false for invalid urls', () => {
    expect(isValidHttpUrl('ftp://example.com')).toBe(false)
    expect(isValidHttpUrl('example.com')).toBe(false)
  })
})

describe('doesMethodAcceptBody', () => {
  it('returns false for GET/HEAD/OPTIONS', () => {
    expect(doesMethodAcceptBody('GET')).toBe(false)
    expect(doesMethodAcceptBody('HEAD')).toBe(false)
    expect(doesMethodAcceptBody('OPTIONS')).toBe(false)
  })

  it('returns true for methods that accept body', () => {
    expect(doesMethodAcceptBody('POST')).toBe(true)
    expect(doesMethodAcceptBody('PUT')).toBe(true)
  })
})

describe('isValidBody', () => {
  it('returns true for valid JSON object', () => {
    expect(isValidBody({ name: 'test' }, 'json', 'POST')).toBe(true)
  })

  it('returns true for valid JSON string', () => {
    expect(isValidBody('{"name":"test"}', 'json', 'POST')).toBe(true)
  })

  it('returns false for invalid JSON string', () => {
    expect(isValidBody('{"name":}', 'json', 'POST')).toBe(false)
  })

  it('returns true for XML when valid', () => {
    expect(isValidBody('<tag>value</tag>', 'xml', 'POST')).toBe(true)
  })

  it('returns false for XML when invalid', () => {
    expect(isValidBody('no tags', 'xml', 'POST')).toBe(false)
  })

  it('returns true for text', () => {
    expect(isValidBody('any string', 'text', 'POST')).toBe(true)
  })

  it('returns false if method does not accept body', () => {
    expect(isValidBody('{"a":1}', 'json', 'GET')).toBe(false)
  })
})

describe('isValidOptions', () => {
  it('returns true for fully valid options', () => {
    const options: Options = {
      url: 'https://api.com',
      method: 'POST',
      headers: [
        {
          name: { content: 'X-Test', isCustom: false },
          value: { content: '123', isCustom: false }
        }
      ],
      body: { content: '{"ok":true}', type: 'json' }
    }
    expect(isValidOptions(options)).toBe(true)
  })

  it('returns false for invalid url', () => {
    const options = {
      url: 'invalid-url',
      method: 'POST',
      headers: [],
      body: undefined
    } as Options
    expect(isValidOptions(options)).toBe(false)
  })

  it('returns false for unsupported method', () => {
    const options = {
      url: 'http://ok.com',
      method: 'INVALID' as any,
      headers: [],
      body: undefined
    } as Options
    expect(isValidOptions(options)).toBe(false)
  })
})
