import CallMapper from "./CallMapper";
import CallsRepository from "./CallsRepository";
import CollectionMapper from "./CollectionMapper";
import CollectionsRepository from "./CollectionsRepository";

export const calls = {
  mapper: CallMapper,
  repository: CallsRepository
}

export const collection = {
  mapper: CollectionMapper,
  repository: CollectionsRepository
}