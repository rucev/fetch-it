<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount } from 'vue'
  import CallsRepository from '../repository/CallsRepository'
  import CallItem from './lateralBar/CallItem.vue'
  import CollectionsRepository from '../repository/CollectionsRepository'
  import CollectionItem from './lateralBar/CollectionItem.vue'

  const props = defineProps<{ 
    setCollection: Function
  }>()

  const displayBar = ref(false)
  const collections = ref<{ name: string; fetchId: string }[]>([])
  const collectionlessCalls = ref<{ name: string; fetchId: string }[]>([])
  const callRepo = new CallsRepository()
  const collectionRep = new CollectionsRepository()
  const sidebarRef = ref<HTMLElement | null>(null)
  const sidebarBtnRef = ref<HTMLElement | null>(null)

  const emit = defineEmits<{
    (event: 'loadCall', id: string): void
  }>()

  const loadSavedCalls = () => {
    collections.value = collectionRep.getAllCollections()
    collectionlessCalls.value = callRepo.getCollectionlessCalls()
  }

  const openMenu = () => {
    displayBar.value = !displayBar.value
    if (displayBar.value) loadSavedCalls()
  }

  const onCallClick = (id: string) => {
    emit('loadCall', id)
    displayBar.value = false
  }

  const onCollectionClick = (id: string) => {
    props.setCollection(id)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && displayBar.value) {
      displayBar.value = false
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.value && sidebarBtnRef.value && !sidebarRef?.value.contains(event.target as Node) && !sidebarBtnRef.value.contains(event.target as Node)){
      displayBar.value = false
    }
  }

  const onExportClick = () => {
    const blob: Blob = callRepo.getAllCallsToDownload()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fetch-it-calls.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const onCollectionEditClick = (id?: string) => {
    if(id) props.setCollection(id)
    else props.setCollection('')
    displayBar.value = false
  }

  const handleFileUpload = (event: Event) => {
      const input = event.target as HTMLInputElement
      const file = input.files?.[0]

      if (!file) return

      const reader = new FileReader()

      reader.onload = (_event) => {
        try {
          const result = _event.target?.result;
          if (typeof result === 'string') {
            const parsedData = JSON.parse(result)
            callRepo.saveMultipleCalls(parsedData)
            loadSavedCalls()
          }
        } catch (error) {
          console.error('Failed to parse JSON: ' + error)
        }
      }

    reader.readAsText(file)

  }

  onMounted(() => {
    loadSavedCalls()
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('click', handleClickOutside)
  })
</script>
<template>
  <div class="absolute z-20 top-0 left-0">
    <button
      ref="sidebarBtnRef"
      class="z-50 absolute top-2 left-2 cursor-pointer p-3 text-stone-200 hover:text-stone-500"
      @click="openMenu"
      :aria-expanded="displayBar"
      aria-controls="saved-calls-sidebar"
      aria-label="Toggle saved calls menu"
    >
      <i :class="['pi text-2xl', displayBar ? 'pi-times' : 'pi-list']" aria-hidden="true"></i>
    </button>
    <aside
      ref="sidebarRef"
      v-if="displayBar"
      id="saved-calls-sidebar"
      class="lat-bar  absolute z-40"
      role="region"
      aria-label="Saved calls sidebar"
    >
      <div class="flex flex-col gap-2 pl-5" >
        <div class="flex flex-row w-full gap-2 justify-start pt-3">
          <h2 class="text-lg font-bold uppercase">Collections</h2>
          <button
            class="cursor-pointer text-stone-200 hover:text-stone-500"
            @click="() => onCollectionEditClick()"
            aria-label="Create new collection"
          >
            <i class="pi pi-plus" aria-hidden="true"></i>
          </button>
        </div>

        <ul class="space-y-2" v-if="collections.length > 0">
          <li
            v-for="collection in collections"
            :key="collection.fetchId"
            class="p-2"
          >
            <CollectionItem :collection="collection" :onCallClick="onCallClick" :onCallDelete="loadSavedCalls" :onEditCollection="onCollectionEditClick"/>
          </li>
          </ul>
      </div>
      <div class="flex flex-col gap-2 pl-5" v-if="collectionlessCalls.length > 0">
        <h2 class="text-lg font-bold mb-2">Other Calls Saved</h2>
        <ul class="space-y-2">
          <li
            v-for="call in collectionlessCalls"
            :key="call.fetchId"
            class="p-2 saved-call"
          >
            <CallItem :call="call" :onCallClick="() => onCallClick(call.fetchId)" :onCallDelete="loadSavedCalls" />
          </li>
          </ul>
      </div>
      <div class="w-full flex flex-row gap-6 justify-start">
        <button aria-label="Export saved calls to a json file" class="download-btn" @click="onExportClick">Export Calls <i class="pi pi-download"></i></button>
        <label for="fileUpload" class="download-btn">
          Import Calls <i class="pi pi-file-import"></i>
          <input
            id="fileUpload"
            @change="handleFileUpload"
            type="file"
            accept="application/json"
            aria-label="Import saved calls from a valid JSON file"
            class="hidden"
            placeholder="Your JSON file"
          />
        </label>    
      </div>
    </aside>
  </div>
</template>
<style scoped>
  @import "tailwindcss";
  

  .lat-bar {
    @apply w-screen max-w-screen h-screen pt-12 pb-10 overflow-y-scroll top-0 flex flex-col justify-between md:w-[720px] bg-stone-900 shadow px-5;
  }

  .saved-call {
    @apply flex flex-row w-full gap-3 items-center justify-start;
  }

  .download-btn {
    @apply max-w-52 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer flex flex-row justify-center gap-3 bg-gray-300 text-stone-800 font-bold py-2 px-4 rounded items-center
  }
</style>
