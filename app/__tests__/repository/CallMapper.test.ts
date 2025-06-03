import CallMapper from '../../src/repository/CallMapper'
import type { Options, ResponseToDisplay, fetchCall } from '../../src/interfaces/interfaces'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

vi.mock('../../src/validators/options', () => ({
  isValidOptions: vi.fn()
}))

import { isValidOptions } from '../../src/validators/options'

const mockUUID = `1234-ABCDE-56789-FGHIJKLMN-10111213`

describe('CallMapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
      ; (isValidOptions as ReturnType<typeof vi.fn>).mockReset()

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(mockUUID)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('toPersistence', () => {
    it('should map valid options and response to fetchCall', () => {
      const options: Options = {
        url: 'https://api.example.com',
        method: 'GET',
        headers: [
          {
            name: { content: 'Content-Type', isCustom: false },
            value: { content: 'application/json', isCustom: false }
          }
        ],
        body: { content: 'test', type: 'text' }
      }

      const response: ResponseToDisplay = {
        statusMsg: 'OK',
        statusCode: 200,
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        body: { message: 'Success' }
      }

        ; (isValidOptions as ReturnType<typeof vi.fn>).mockReturnValue(true)

      const result = CallMapper.toPersistence(options, response)

      expect(result).toEqual({
        name: 'GET https://api.example.com',
        fetchId: mockUUID,
        request: {
          method: 'GET',
          url: 'https://api.example.com',
          header: options.headers,
          body: { content: 'test', type: 'text' }
        },
        response: {
          status: 'OK',
          code: 200,
          header: [{ name: 'Content-Type', value: 'application/json' }],
          body: JSON.stringify({ message: 'Success' })
        }
      })
    })

    it('should throw an error if options are invalid', () => {
      const options = {} as Options
        ; (isValidOptions as ReturnType<typeof vi.fn>).mockReturnValue(false)

      expect(() => CallMapper.toPersistence(options, undefined)).toThrow('Error mapping call')
    })
  })

  describe('toDomain', () => {
    it('should map fetchCall to options, response, and metadata', () => {
      const savedCall: fetchCall = {
        name: 'GET https://api.example.com',
        fetchId: mockUUID,
        request: {
          method: 'GET',
          url: 'https://api.example.com',
          header: [
            {
              name: { content: 'Content-Type', isCustom: false },
              value: { content: 'application/json', isCustom: false }
            }
          ],
          body: { content: 'test', type: 'text' }
        },
        response: {
          status: 'OK',
          code: 200,
          header: [{ name: 'Content-Type', value: 'application/json' }],
          body: JSON.stringify({ message: 'Success' })
        }
      }

      const [options, response, meta] = CallMapper.toDomain(savedCall)

      expect(options).toEqual({
        method: 'GET',
        url: 'https://api.example.com',
        headers: savedCall.request.header,
        body: { content: 'test', type: 'text' }
      })

      expect(response).toEqual({
        statusMsg: 'OK',
        statusCode: 200,
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        body: { message: 'Success' }
      })

      expect(meta).toEqual({ name: savedCall.name, fetchId: savedCall.fetchId })
    })

    it('should return undefined for response if savedCall has no response', () => {
      const savedCall: fetchCall = {
        name: 'GET https://api.example.com',
        fetchId: mockUUID,
        request: {
          method: 'GET',
          url: 'https://api.example.com',
          header: [
            {
              name: { content: 'Content-Type', isCustom: false },
              value: { content: 'application/json', isCustom: false }
            }
          ],
          body: { content: 'test', type: 'text' }
        },
        response: undefined
      }

      const [, response] = CallMapper.toDomain(savedCall)
      expect(response).toBeUndefined()
    })
  })
})
