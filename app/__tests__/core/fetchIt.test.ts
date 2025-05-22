import { formatResponse, callFetch } from '../../src/core/fetchIt'
import { describe, expect, it, beforeEach, jest, afterEach } from '@jest/globals'

jest.mock('../../src/validators/options', () => ({
    isValidOptions: jest.fn()
}))

import { isValidOptions } from '../../src/validators/options'

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

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
            headers: [{ name: 'content-type', value: 'application/json' }, { name: 'x-test', value: '123' }],
            body: { message: 'ok' },
            statusCode: 200,
            statusMsg: 'OK'
        })
    })
})

describe('callFetch', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should throw if options are invalid', async () => {
        (isValidOptions as jest.Mock).mockReturnValue(false)

        await expect(
            callFetch({
                method: 'GET',
                url: 'https://example.com'
            } as any)
        ).rejects.toThrow('Wrong options setup')
    })

    it('should call fetch with correct params and format the response', async () => {
        (isValidOptions as jest.Mock).mockReturnValue(true)

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

        expect(global.fetch).toHaveBeenCalledWith('https://api.test.com', {
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
