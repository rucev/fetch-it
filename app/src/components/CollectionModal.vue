<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import type { fetchCollection } from '../interfaces/interfaces';
  import CollectionsRepository from '../repository/CollectionsRepository';
  import CallsRepository from '../repository/CallsRepository';
  import CollectionMapper from '../repository/CollectionMapper';

  const props = defineProps<{
    collectionId?: string
    onClose: () => void
  }>()

  const collection = ref<fetchCollection | null>(null)
  const collectionName = ref<string | undefined>(undefined)
  const calls = ref<{ name: string; fetchId: string }[]>([])

  const collectionRepo = new CollectionsRepository()
  const callRepo = new CallsRepository()

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') props.onClose()
  }

  const onSubmit = (event: Event) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const newName = formData.get('name')?.toString()
    const newCalls = formData.getAll('calls') as string[]

    if (collection.value && props.collectionId && newName) {
      collectionRepo.updateCollectionNameById(props.collectionId, newName)
      collectionRepo.updateAllCallsFromCollection(props.collectionId, ...newCalls)
    } else {
      const newCollection = CollectionMapper.toPersistence(newCalls, newName)
      collectionRepo.saveCollection(newCollection)
    }
    props.onClose()
  }

  onMounted(() => {
    if(props.collectionId){ 
      const foundColleciton = collectionRepo.loadCollectionById(props.collectionId)
      if(foundColleciton) {
        collection.value = foundColleciton
        collectionName.value = foundColleciton.name
      }
    }
    calls.value = callRepo.getAllCalls()
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
</script>
<template>
  <div class="fixed inset-0 h-screen w-screen flex items-center justify-center z-40" role="dialog"
    aria-modal="true" aria-labelledby="collection">
    <div
      class="bg-stone-700 text-gray-50 max-h-4/5 min-w-1/2 w-fit max-w-4/5 flex flex-col shadow-2xl rounded-sm py-2 px-3">
      <div class="flex flex-row gap-2 w-full justify-between">
        <h3 class="text-2xl font-extrabold mb-2">Collection</h3>
        <button class="close-btn" @click="() => onClose()" aria-label="Close collection dialog">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <form @submit="onSubmit">
        <label for="name" >Collection Name</label>
        <input id="name" name="name" type="text" placeholder="MyGreatCollection" v-model="collectionName" />
        <p>Calls</p>
        <div class="flex flex-row w-full justify-start gap-1 items-center" v-for="call in calls">
          <input class="max-w-fit" type="checkbox" :id="`checkbox-${call.fetchId}`" :name="'calls'" :value="call.fetchId" :checked="collection?.calls?.includes(call.fetchId)" />
          <label class="w-full pt-1" for="checkbox-{call.fetchId}">{{ call.name }}</label>
        </div>
        <input class="flex flex-row gap-2 bg-stone-800 font-bold py-2 px-4 rounded items-center hover:bg-stone-950 focus:ring-2 focus:ring-offset-2 focus:ring-stone-800 cursor-pointer"
        type="submit" :value="collection ? 'Update Collection' : 'Save Collection'" />
      </form>
    </div>
  </div>
</template>
<style scoped>
  @import "tailwindcss";
  input {
    @apply mt-2 w-full border border-stone-600 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 sm:text-sm;
  }

  .close-btn {
    @apply cursor-pointer hover:text-gray-400 px-2 py-1
  }
</style>
