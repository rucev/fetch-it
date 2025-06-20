import type { fetchCall, fetchCollection, fetchCollectionDisplay } from '../interfaces/interfaces'
import CallsRepository from './CallsRepository'

export default class CollectionMapper {
  static toPersistence(calls: string[], name: string | undefined): fetchCollection {
    const id = crypto.randomUUID()
    const collection: fetchCollection = {
      name: name ? name : `Collection-${id}`,
      fetchId: id,
      calls
    }
    return collection
  }

  static toDomain(savedCollection: fetchCollection): fetchCollectionDisplay {
    const callRepo = new CallsRepository()
    const foundCalls: (fetchCall | undefined)[] = savedCollection.calls.map(call => {
      const foundCall = callRepo.loadCallById(call)
      if (foundCall) return foundCall
    })
    const calls: fetchCall[] = foundCalls.filter(call => call !== undefined)

    const collection: fetchCollectionDisplay = {
      name: savedCollection.name,
      fetchId: savedCollection.fetchId,
      calls
    }

    return collection
  }
}