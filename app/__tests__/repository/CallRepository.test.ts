import CallsRepository from '../../src/repository/CallsRepository'
import type { Options, ResponseToDisplay, fetchCall } from '../../src/interfaces/interfaces'
import { describe, expect, it, beforeEach, jest } from '@jest/globals'

describe('CallsRepository', () => {
    let repo: CallsRepository


    beforeEach(() => {
        const store: Record<string, string> = {}

        const mockLocalStorage: jest.Mocked<Storage> = {
            getItem: jest.fn((key: string) => store[key] || null),
            setItem: jest.fn((key: string, value: string) => { store[key] = value }),
            removeItem: jest.fn((key: string) => { delete store[key] }),
            clear: jest.fn(() => {
                for (const key in store) delete store[key]
            }),
            key: jest.fn((index: number) => Object.keys(store)[index] || null),
            get length() {
                return Object.keys(store).length
            },
        }

        globalThis.localStorage = mockLocalStorage

        repo = new CallsRepository()
    })

    const sampleCall: fetchCall = {
        name: 'GET https://api.test.com',
        fetchId: 'abc-123',
        request: {
            method: 'GET',
            url: 'https://api.test.com',
            header: [],
            body: undefined
        },
        response: undefined
    }

    describe('saveCall', () => {
        it('should save a new call to localStorage', () => {
            repo.saveCall(sampleCall)
            expect(localStorage.setItem).toHaveBeenCalled()

            const raw = localStorage.getItem('fetch-calls')
            const savedData = raw !== null ? JSON.parse(raw) : null

            expect(savedData).toContainEqual(sampleCall)
        })

        it('should append call if calls already exist', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([sampleCall]))

            const newCall = { ...sampleCall, fetchId: 'xyz-789' }
            repo.saveCall(newCall)


            const raw = localStorage.getItem('fetch-calls')
            const savedData = raw !== null ? JSON.parse(raw) : null

            expect(savedData.length).toBe(2)
            expect(savedData).toContainEqual(sampleCall)
            expect(savedData).toContainEqual(newCall)
        })
    })

    describe('getAllCalls', () => {
        it('should return empty array if no calls saved', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(null)
            expect(repo.getAllCalls()).toEqual([])
        })

        it('should return array of {name, fetchId} objects', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([sampleCall]))
            expect(repo.getAllCalls()).toEqual([{ name: sampleCall.name, fetchId: sampleCall.fetchId }])
        })
    })

    describe('loadCallById', () => {
        it('should return the call by fetchId', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([sampleCall]))
            expect(repo.loadCallById(sampleCall.fetchId)).toEqual(sampleCall)
        })

        it('should return undefined if call not found', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([]))
            expect(repo.loadCallById('nonexistent')).toBeUndefined()
        })
    })

    describe('deleteCallById', () => {
        it('should delete the call by fetchId', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([sampleCall]))
            repo.deleteCallById(sampleCall.fetchId)

            const raw = localStorage.getItem('fetch-calls')
            const savedData = raw !== null ? JSON.parse(raw) : null
            expect(savedData).toEqual([])
        })

        it('should do nothing if call not found', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([sampleCall]))
            repo.deleteCallById('nonexistent')
            expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
})