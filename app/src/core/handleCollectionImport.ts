import type { fetchCollection, fetchCollectionDisplay } from "../interfaces/interfaces";
import CallsRepository from "../repository/CallsRepository";
import CollectionsRepository from "../repository/CollectionsRepository";

export default (collection: fetchCollectionDisplay) => {
  const callRepo = new CallsRepository()
  const collectionRepo = new CollectionsRepository()

  callRepo.saveMultipleCalls(collection.calls)

  const newCollection: fetchCollection = {
    name: collection.name,
    fetchId: collection.fetchId,
    calls: collection.calls.map(call => call.fetchId)
  }

  collectionRepo.saveCollection(newCollection)
}