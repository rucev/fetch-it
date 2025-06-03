import generateCurl from '../../src/core/generateCurl'
import type { Options } from '../../src/interfaces/interfaces'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

vi.mock('../../src/validators/options', () => ({
  isValidOptions: vi.fn()
}))

import { isValidOptions } from '../../src/validators/options'

describe('generateCurl', () => {
  const baseOptions: Options = {
    method: 'GET',
    url: 'https://example.com',
    headers: [],
    body: undefined
  }

  beforeEach(() => {
    ; (isValidOptions as ReturnType<typeof vi.fn>).mockReturnValue(true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw an error if options are invalid', () => {
    ; (isValidOptions as ReturnType<typeof vi.fn>).mockReturnValue(false)
    expect(() => generateCurl(baseOptions, false)).toThrow('Invalid options')
  })

  it('should return minimal curl command', () => {
    const result = generateCurl(baseOptions, false)
    expect(result).toEqual(['curl -X GET "https://example.com"'])
  })

  it('should include headers if provided', () => {
    const options: Options = {
      ...baseOptions,
      headers: [
        { name: { content: 'Content-Type', isCustom: false }, value: { content: 'application/json', isCustom: false } },
        { name: { content: 'Authorization', isCustom: false }, value: { content: 'Bearer token', isCustom: true } }
      ]
    }

    const result = generateCurl(options, false)
    expect(result).toEqual([
      'curl -X GET "https://example.com" \\',
      '-H "Content-Type: application/json" \\',
      '-H "Authorization: Bearer token"'
    ])
  })

  it('should include JSON body correctly', () => {
    const options: Options = {
      ...baseOptions,
      method: 'POST',
      body: {
        type: 'json',
        content: { message: 'hello' }
      }
    }

    const result = generateCurl(options, false)
    expect(result).toEqual([
      'curl -X POST "https://example.com" \\',
      `-d '{"message":"hello"}'`
    ])
  })

  it('should include raw string body when JSON parse fails', () => {
    const options: Options = {
      ...baseOptions,
      method: 'POST',
      body: {
        type: 'json',
        content: '{"invalidJson":'
      }
    }

    const result = generateCurl(options, false)
    expect(result).toEqual([
      'curl -X POST "https://example.com" \\',
      `-d '{"invalidJson":'`
    ])
  })

  it('should include verbose flag if isVerbose is true', () => {
    const result = generateCurl(baseOptions, true)
    expect(result).toEqual(['curl -X GET "https://example.com" -v'])
  })
})
