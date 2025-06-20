import type { fetchCall, fetchCollection } from "../interfaces/interfaces"

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

  updateAllCallsFromCollection(collectionId: string, ...calls: string[]): void {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const collectionIndex: number = collections.findIndex(collection => collection.fetchId === collectionId)

      if (collectionIndex !== -1) {
        collections[collectionIndex].calls = calls

        localStorage.setItem('fetch-collections', JSON.stringify(collections))
      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error(`Error saving collection: ${error}`)
    }
  }

  updateCollectionNameById(collectionId: string, newName: string): void {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const collectionIndex: number = collections.findIndex(collection => collection.fetchId === collectionId)

      if (collectionIndex !== -1) {
        collections[collectionIndex].name = newName

        localStorage.setItem('fetch-collections', JSON.stringify(collections))
      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error(`Error saving collection: ${error}`)
    }
  }

  deleteCollectionById(collectionId: string): void {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const collectionIndex: number = collections.findIndex(collection => collection.fetchId === collectionId)

      if (collectionIndex !== -1) {
        collections.splice(collectionIndex, 1)

        localStorage.setItem('fetch-collections', JSON.stringify(collections))
      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error(`Error saving collection: ${error}`)
    }
  }

  getAllCollections(): { name: string, fetchId: string }[] {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []
      return collections.map(collection => { return { name: collection.name, fetchId: collection.fetchId } })
    } catch (error) {
      throw new Error(`Error loading collections: ${error}`)
    }
  }

  loadCollectionById(collectionId: string): fetchCollection | undefined {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const foundCollection: fetchCollection | undefined = collections.find(collection => collection.fetchId === collectionId)
      return foundCollection
    } catch (error) {
      throw new Error(`Error loading collections: ${error}`)
    }
  }


  getCollectionToDownload(collectionId: string): Blob {
    try {
      const _collections = localStorage.getItem('fetch-collections') ?? ''
      const _calls = localStorage.getItem('fetch-calls') ?? ''
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []
      const calls: fetchCall[] = _calls ? JSON.parse(_calls) : []

      const foundCollection: fetchCollection | undefined = collections.find(collection => collection.fetchId === collectionId)
      if (foundCollection) {
        const filteredCalls = calls.filter(call => foundCollection.calls.includes(call.fetchId))
        const collection = {
          fetchId: foundCollection.fetchId,
          name: foundCollection.name,
          calls: filteredCalls
        }
        const blob = new Blob([JSON.stringify(collection)], { type: "application/json" })
        return blob
      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error('Error setting previous calls to download')
    }
  }
}