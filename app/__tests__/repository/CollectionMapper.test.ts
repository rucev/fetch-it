import CollectionMapper from '../../src/repository/CollectionMapper'
import type { fetchCall, fetchCollection } from '../../src/interfaces/interfaces'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/repository/CallsRepository', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      loadCallById: vi.fn((id: string) => mockCalls.find(call => call.fetchId === id))
    }))
  }
})

const mockUUID = 'mock-uuid-1234-3213-test'
const mockCalls: fetchCall[] = [
  {
    name: 'GET https://example.api',
    fetchId: 'id-1',
    request: {
      method: 'GET',
      url: 'https://example.api',
      header: [],
      body: undefined
    },
    response: {
      status: 'OK',
      code: 200,
      header: [],
      body: JSON.stringify({ success: true })
    }
  },
  {
    name: 'POST https://example.api',
    fetchId: 'id-2',
    request: {
      method: 'POST',
      url: 'https://example.api',
      header: [],
      body: { content: 'data', type: 'text' }
    },
    response: undefined
  }
]

describe('CollectionMapper', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(mockUUID)
  })

  describe('toPersistence', () => {
    it('should map fetchCall[] to fetchCollection with name', () => {
      const result = CollectionMapper.toPersistence(mockCalls, 'MyCollection')

      expect(result).toEqual({
        name: 'MyCollection',
        fetchId: mockUUID,
        calls: ['id-1', 'id-2']
      })
    })

    it('should use default name if none provided', () => {
      const result = CollectionMapper.toPersistence(mockCalls, undefined)

      expect(result).toEqual({
        name: `Collection-${mockUUID}`,
        fetchId: mockUUID,
        calls: ['id-1', 'id-2']
      })
    })
  })

  describe('toDomain', () => {
    it('should map fetchCollection to fetchCollectionDisplay', () => {
      const savedCollection: fetchCollection = {
        name: 'Restored Collection',
        fetchId: mockUUID,
        calls: ['id-1', 'id-2']
      }

      const result = CollectionMapper.toDomain(savedCollection)

      expect(result).toEqual({
        name: 'Restored Collection',
        fetchId: mockUUID,
        calls: mockCalls
      })
    })

    it('should filter out undefined calls', () => {
      const savedCollection: fetchCollection = {
        name: 'Incomplete Collection',
        fetchId: mockUUID,
        calls: ['id-1', 'non-existent-id']
      }

      const result = CollectionMapper.toDomain(savedCollection)

      expect(result).toEqual({
        name: 'Incomplete Collection',
        fetchId: mockUUID,
        calls: [mockCalls[0]]
      })
    })
  })
})
