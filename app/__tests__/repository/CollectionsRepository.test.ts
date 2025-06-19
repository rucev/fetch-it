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

  const sampleCall4: fetchCall = {
    name: 'GET https://api4.test.com',
    fetchId: 'lmn-456',
    request: {
      method: 'GET',
      url: 'https://api4.test.com',
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
    calls: [sampleCall2.fetchId, sampleCall3.fetchId, sampleCall4.fetchId],
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

    it('should append collection if collections already exist', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection]))

      repo.saveCollection(sampleCollection2)

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null

      expect(savedData.length).toBe(2)
      expect(savedData).toContainEqual(sampleCollection)
      expect(savedData).toContainEqual(sampleCollection2)
    })
  })

  describe('addCallsToCollection', () => {
    it('should add calls to an existent collection to localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection]))
      repo.addCallsToCollection(sampleCollection.fetchId, sampleCall3.fetchId, sampleCall4.fetchId)

      expect(localStorage.getItem).toHaveBeenCalled()
      expect(localStorage.setItem).toHaveBeenCalled()

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null
      const updatedCollection: fetchCollection | undefined = savedData.find(collection => collection.fetchId === sampleCollection.fetchId)

      expect(updatedCollection?.calls).toContainEqual(sampleCall.fetchId)
      expect(updatedCollection?.calls).toContainEqual(sampleCall2.fetchId)
      expect(updatedCollection?.calls).toContainEqual(sampleCall3.fetchId)
      expect(updatedCollection?.calls).toContainEqual(sampleCall4.fetchId)
      expect(updatedCollection?.calls.length).toEqual(4)
    })
  })

  describe('deleteCallsFromCollection', () => {
    it('should delete calls from an existent collection in localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection2]))
      repo.deleteCallsFromCollection(sampleCollection2.fetchId, sampleCall3.fetchId, sampleCall4.fetchId)

      expect(localStorage.getItem).toHaveBeenCalled()
      expect(localStorage.setItem).toHaveBeenCalled()

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null
      const updatedCollection: fetchCollection | undefined = savedData.find(collection => collection.fetchId === sampleCollection2.fetchId)

      expect(updatedCollection?.calls).toContainEqual(sampleCall2.fetchId)
      expect(updatedCollection?.calls.length).toEqual(1)
    })
  })

  describe('updateAllCallsFromCollection', () => {
    it('should update all calls from an existent collection to localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection]))
      repo.updateAllCallsFromCollection(sampleCollection.fetchId, sampleCall3.fetchId, sampleCall4.fetchId)

      expect(localStorage.getItem).toHaveBeenCalled()
      expect(localStorage.setItem).toHaveBeenCalled()

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null
      const updatedCollection: fetchCollection | undefined = savedData.find(collection => collection.fetchId === sampleCollection.fetchId)

      expect(updatedCollection?.calls).toContainEqual(sampleCall3.fetchId)
      expect(updatedCollection?.calls).toContainEqual(sampleCall4.fetchId)
      expect(updatedCollection?.calls.length).toEqual(2)
    })
  })

  describe('updateCollectionName', () => {
    it('should change the name of a collection saved in localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection]))
      repo.updateCollectionName(sampleCollection.fetchId, 'collection new name')

      expect(localStorage.getItem).toHaveBeenCalled()
      expect(localStorage.setItem).toHaveBeenCalled()

      const raw = localStorage.getItem('fetch-collections')
      const savedData = raw !== null ? JSON.parse(raw) : null
      const updatedCollection: fetchCollection | undefined = savedData.find(collection => collection.fetchId === sampleCollection.fetchId)

      expect(updatedCollection?.name).toBe('collection new name')
    })
  })

})
