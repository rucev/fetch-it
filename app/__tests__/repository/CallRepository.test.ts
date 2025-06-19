import CallsRepository from '../../src/repository/CallsRepository'
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
    calls: [sampleCall2.fetchId, sampleCall3.fetchId],
    name: 'Test2Collection',
    fetchId: 'test2-id'
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

      repo.saveCall(sampleCall2)

      const raw = localStorage.getItem('fetch-calls')
      const savedData = raw !== null ? JSON.parse(raw) : null

      expect(savedData.length).toBe(2)
      expect(savedData).toContainEqual(sampleCall)
      expect(savedData).toContainEqual(sampleCall2)
    })
  })

  describe('saveMultipleCalls', () => {
    it('should save multiple calls to localStorage', () => {
      repo.saveMultipleCalls([sampleCall, sampleCall2])
      expect(localStorage.setItem).toHaveBeenCalled()

      const raw = localStorage.getItem('fetch-calls')
      const savedData = raw !== null ? JSON.parse(raw) : null

      expect(savedData).toContainEqual(sampleCall)
      expect(savedData).toContainEqual(sampleCall2)
    })

    it('should append new calls if other calls already exist', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))

      repo.saveMultipleCalls([sampleCall2, sampleCall3])

      const raw = localStorage.getItem('fetch-calls')
      const savedData = raw !== null ? JSON.parse(raw) : null

      expect(savedData.length).toBe(3)
      expect(savedData).toContainEqual(sampleCall)
      expect(savedData).toContainEqual(sampleCall2)
      expect(savedData).toContainEqual(sampleCall3)
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

  describe('getAllCallsToDownload', () => {
    const json = JSON.stringify([sampleCall])
    const blobMock = new Blob([json], { type: "application/json" });

    it('should return array of {name, fetchId} objects', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall]))
      expect(repo.getAllCallsToDownload()).toEqual(blobMock)
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

  describe('getCollectionlessCalls', () => {
    it('should get all calls that are not in a collection', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection]))
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall, sampleCall2, sampleCall3, sampleCall4]))
      const calls = repo.getCollectionlessCalls()

      expect(calls.length).toBe(2)
      expect(calls).toContainEqual({ name: sampleCall3.name, fetchId: sampleCall3.fetchId })
      expect(calls).toContainEqual({ name: sampleCall4.name, fetchId: sampleCall4.fetchId })
    })
  })

  describe('getCallsByCollection', () => {
    it('should get all calls that are not in a collection', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCollection, sampleCollection2]))
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall, sampleCall2, sampleCall3, sampleCall4]))
      const calls = repo.getCallsByCollection(sampleCollection2.fetchId)

      expect(calls.length).toBe(2)
      expect(calls).toContainEqual({ name: sampleCall3.name, fetchId: sampleCall3.fetchId })
      expect(calls).toContainEqual({ name: sampleCall2.name, fetchId: sampleCall2.fetchId })
    })
  })

  describe('updateCallNameById', () => {
    it('should change the call name by fetchId', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify([sampleCall, sampleCall2, sampleCall3]))
      repo.updateCallNameById(sampleCall2.fetchId, 'new call name')

      const raw = localStorage.getItem('fetch-calls')
      const savedData = raw !== null ? JSON.parse(raw) : null

      const updatedCall: fetchCall | undefined = savedData.find(call => call.fetchId === sampleCall2.fetchId)

      expect(updatedCall?.name).toBe('new call name')

      expect(savedData.length).toBe(3)
      expect(savedData).toContainEqual(sampleCall)
      expect(savedData).toContainEqual(sampleCall3)
    })
  })
})
