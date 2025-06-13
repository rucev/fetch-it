import type { fetchCollection } from "../interfaces/interfaces"

export default class CollectionsRepository {
  saveCollection(collection: fetchCollection): void {
    try {
      const _previousCollections: string | null = localStorage.getItem('fetch-collections')
      const previousCollections: fetchCollection[] = _previousCollections ? JSON.parse(_previousCollections) : []
      previousCollections.push(collection)
      localStorage.setItem('fetch-collections', JSON.stringify(previousCollections))
    } catch (error) {
      throw new Error('Error saving collection')
    }
  }
}