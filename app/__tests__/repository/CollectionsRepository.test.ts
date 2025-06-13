import CollectionsRepository from '../../src/repository/CollectionsRepository'
import type { fetchCall, fetchCollection } from '../../src/interfaces/interfaces'
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
  let repo: CollectionsRepository

  beforeEach(() => {
    repo = new CollectionsRepository()
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

  const sampleCall2: fetchCall = {
    name: 'GET https://api2.test.com',
    fetchId: 'aei-123',
    request: {
      method: 'GET',
      url: 'https://api2.test.com',
      header: [],
      body: undefined,
    },
    response: undefined,
  }

  const sampleCall3: fetchCall = {
    name: 'GET https://api3.test.com',
    fetchId: 'xyz-123',
    request: {
      method: 'GET',
      url: 'https://api3.test.com',
      header: [],
      body: undefined,
    },
    response: undefined,
  }

  const sampleCollection: fetchCollection = {
    calls: [sampleCall.fetchId, sampleCall2.fetchId],
    name: 'TestCollection',
    fetchId: 'test-id'
  }

  const sampleCollection2: fetchCollection = {
    calls: [sampleCall2.fetchId, sampleCall3.fetchId],
    name: 'Test2Collection',
    fetchId: 'test2-id'
  }

  describe('saveCollection', () => {
    it('should save a new collection to localStorage', () => {
      repo.saveCollection(sampleCollection)
      expect(localStorage.setItem).toHaveBeenCalled()

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null

      expect(savedData).toContainEqual(sampleCollection)
    })

    it('should append call if calls already exist', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection]))

      repo.saveCollection(sampleCollection2)

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null

      expect(savedData.length).toBe(2)
      expect(savedData).toContainEqual(sampleCollection)
      expect(savedData).toContainEqual(sampleCollection2)
    })
  })
})
