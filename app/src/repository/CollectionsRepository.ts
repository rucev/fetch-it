import type { fetchCollection } from "../interfaces/interfaces"

export default class CollectionsRepository {
  saveCollection(collection: fetchCollection): void {
    try {
      const _previousCollections: string | null = localStorage.getItem('fetch-collections')
      const previousCollections: fetchCollection[] = _previousCollections ? JSON.parse(_previousCollections) : []
      previousCollections.push(collection)
      localStorage.setItem('fetch-collections', JSON.stringify(previousCollections))
    } catch (error) {
      throw new Error(`Error saving collection: ${error}`)
    }
  }

  addCallsToCollection(collectionId: string, ...calls: string[]): void {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const collectionIndex: number = collections.findIndex(collection => collection.fetchId === collectionId)

      if (collectionIndex !== -1) {
        collections[collectionIndex].calls = [...collections[collectionIndex].calls, ...calls]

        localStorage.setItem('fetch-collections', JSON.stringify(collections))
      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error(`Error saving collection: ${error}`)
    }
  }

  deleteCallsFromCollection(collectionId: string, ...calls: string[]): void {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const collectionIndex: number = collections.findIndex(collection => collection.fetchId === collectionId)

      if (collectionIndex !== -1) {
        const oldCalls = collections[collectionIndex].calls
        const filteredCalls = oldCalls.filter(call => !calls.includes(call))
        collections[collectionIndex].calls = filteredCalls

        localStorage.setItem('fetch-collections', JSON.stringify(collections))
      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error(`Error saving collection: ${error}`)
    }
  }



}