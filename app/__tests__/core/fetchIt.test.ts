import callFetch, { formatResponse } from '../../src/core/fetchIt'
import { describe, expect, it, beforeEach, afterEach, vi, MockedFunction } from 'vitest'

vi.mock('../../src/validators/options', () => ({
  isValidOptions: vi.fn()
}))

import { isValidOptions } from '../../src/validators/options'

const mockFetch = vi.fn() as unknown as MockedFunction<typeof fetch>
globalThis.fetch = mockFetch

describe('formatResponse', () => {
  it('should parse JSON body and headers correctly', async () => {
    const mockHeaders = new Headers({ 'Content-Type': 'application/json', 'X-Test': '123' })
    const mockResponse = new Response(JSON.stringify({ message: 'ok' }), {
      status: 200,
      headers: mockHeaders,
      statusText: 'OK'
    })

    const result = await formatResponse(mockResponse)

    expect(result).toEqual({
      headers: [
        { name: 'content-type', value: 'application/json' },
        { name: 'x-test', value: '123' }
      ],
      body: { message: 'ok' },
      statusCode: 200,
      statusMsg: 'OK'
    })
  })
})

describe('callFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw if options are invalid', async () => {
    ; (isValidOptions as ReturnType<typeof vi.fn>).mockReturnValue(false)

    await expect(
      callFetch({
        method: 'GET',
        url: 'https://example.com'
      } as any)
    ).rejects.toThrow('Wrong options setup')
  })

  it('should call fetch with correct params and format the response', async () => {
    ; (isValidOptions as ReturnType<typeof vi.fn>).mockReturnValue(true)

    const mockJson = { data: 'value' }

    const mockResponse = new Response(JSON.stringify(mockJson), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      statusText: 'OK'
    })

    mockFetch.mockResolvedValue(mockResponse)

    const result = await callFetch({
      method: 'POST',
      url: 'https://api.test.com',
      headers: [
        { name: { content: 'Content-Type', isCustom: false }, value: { content: 'application/json', isCustom: false } }
      ],
      body: {
        type: 'json',
        content: { data: 'value' }
      }
    })

    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.test.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: 'value' })
    })

    expect(result).toEqual({
      headers: expect.any(Array),
      body: mockJson,
      statusCode: 200,
      statusMsg: 'OK'
    })
  })
})
