import CallsRepository from '../../src/repository/CallsRepository'
import type { fetchCall } from '../../src/interfaces/interfaces'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

const store: Record<string, string> = {}

const mockLocalStorage: Storage = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key]
  }),
  clear: vi.fn(() => {
    for (const key in store) delete store[key]
  }),
  key: vi.fn((index: number) => Object.keys(store)[index] || null),
  get length() {
    return Object.keys(store).length
  },
}

globalThis.localStorage = mockLocalStorage

describe('CallsRepository', () => {
  let repo: CallsRepository

  beforeEach(() => {
    repo = new CallsRepository()
  })

  afterEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.clear()
  })

  const sampleCall: fetchCall = {
    name: 'GET https://api.test.com',
    fetchId: 'abc-123',
    request: {
      method: 'GET',
      url: 'https://api.test.com',
      header: [],
      body: undefined,
    },
    response: undefined,
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
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))

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
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(null)
      expect(repo.getAllCalls()).toEqual([])
    })

    it('should return array of {name, fetchId} objects', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))
      expect(repo.getAllCalls()).toEqual([{ name: sampleCall.name, fetchId: sampleCall.fetchId }])
    })
  })

  describe('loadCallById', () => {
    it('should return the call by fetchId', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))
      expect(repo.loadCallById(sampleCall.fetchId)).toEqual(sampleCall)
    })

    it('should return undefined if call not found', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([]))
      expect(repo.loadCallById('nonexistent')).toBeUndefined()
    })
  })

  describe('deleteCallById', () => {
    it('should delete the call by fetchId', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))
      repo.deleteCallById(sampleCall.fetchId)

      const raw = localStorage.getItem('fetch-calls')
      const savedData = raw !== null ? JSON.parse(raw) : null
      expect(savedData).toEqual([])
    })

    it('should do nothing if call not found', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))
      repo.deleteCallById('nonexistent')
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })
})
