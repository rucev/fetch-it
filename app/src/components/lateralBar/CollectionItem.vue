<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount } from 'vue'
  import CallsRepository from '../../repository/CallsRepository'
  import CallItem from './CallItem.vue'
  import CollectionsRepository from '../../repository/CollectionsRepository'

  const props = defineProps<{ 
    collection: {name: string, fetchId: string},
    onCallClick: Function,
    onCallDelete: Function,
    onEditCollection: Function
  }>()

  const callRepo = new CallsRepository()
  const collectionRepo = new CollectionsRepository()
  const menuRef = ref<HTMLElement | null>(null)
  const displayCollectionMenu = ref<boolean>(false)
  const showFullCollection = ref<boolean>(false)
  const calls =  ref<{ name: string; fetchId: string }[]>([])

  const onMenuClick = () => {
    displayCollectionMenu.value = !displayCollectionMenu.value
  }

  const onCollectionClick = () => {
    if(calls.value.length === 0) calls.value = callRepo.getCallsByCollection(props.collection.fetchId)
    showFullCollection.value = !showFullCollection.value
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.value && menuRef.value && !menuRef?.value.contains(event.target as Node) && !menuRef.value.contains(event.target as Node)){
      displayCollectionMenu.value = false
    }
  }

  const onExportClick = () => {
    const blob: Blob = collectionRepo.getCollectionToDownload(props.collection.fetchId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const collectionNameFile = props.collection.name
      .replace(/[\/:*?"<>|]/g, '')                 // invalid characters
      .replace(/\s+/g, '-')                        // spaces
      .replace(/-+/g, '-').replace(/^-+|-+$/g, '') // fix excesive '-'
    a.download = `${collectionNameFile}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onDeleteCollection = () => {
    collectionRepo.deleteCollectionById(props.collection.fetchId)
    props.onCallDelete()
  }

  onMounted(() => {
    window.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside)
  })
</script>
<template>
  <div class="flex flex-row items-center">
      <div ref="menuRef" >
        <button
          @click="onMenuClick"
          class=" hover:text-gray-400 cursor-pointer"
          aria-label="Open Call Options Menu"
        >
          <i :class="['pi text-xl', displayCollectionMenu ? 'pi-times' : 'pi-ellipsis-v']" aria-hidden="true"></i>
        </button>
        <div v-if="displayCollectionMenu" class="absolute min-w-fit w-20 z-20 ml-2 inline-block py-2 text-sm font-medium text-white bg-stone-700 rounded-lg shadow-xs">
          <ul class="py-2 text-sm text-start" aria-labelledby="callMenu">
            <li>
              <button class="block px-4 py-2 hover:bg-stone-600 w-full text-start" @click="onExportClick">Export Collection</button>
            </li>
            <li>
              <button class="block px-4 py-2 hover:bg-stone-600 w-full text-start" @click="() => onEditCollection(collection.fetchId)">Edit Collection</button>
            </li>
            <li>
              <button class="block px-4 py-2 hover:bg-stone-600 w-full text-start" @click="onDeleteCollection">Delete Collection</button>
            </li>
          </ul>
        </div>
      </div>
      <button
        @click="onCollectionClick"
        class="relative top-0 left-0 cursor-pointer w-full pb-2 pl-2 text-xl font-semibold hover:text-gray-400 text-start z-10"
        :aria-label="`Load saved call ${collection.name}`"
      >
        {{ collection.name }}
      </button>
    </div>
      <div class="flex flex-col gap-2" v-if="calls.length > 0 && showFullCollection">
        <ul class="space-y-2" >
          <li
            v-for="call in calls"
            :key="call.fetchId"
            class="pl-7 saved-call"
          >
            <CallItem :call="call" :onCallClick="() => onCallClick(call.fetchId)" :onCallDelete="onCallDelete" />
          </li>
          </ul>
      </div>
</template>
<style scoped>
  @import "tailwindcss";
  

  .saved-calls-container {
    @apply w-screen max-w-screen h-screen top-0 flex flex-col justify-between md:w-[720px] bg-stone-900 shadow pt-14 px-5 pb-10;
  }

  .saved-call {
    @apply flex flex-row w-full gap-3 items-center justify-start;
  }

  .download-btn {
    @apply max-w-52 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer flex flex-row justify-center gap-3 bg-gray-300 text-stone-800 font-bold py-2 px-4 rounded items-center
  }
</style>
