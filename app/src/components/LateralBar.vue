<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount } from 'vue'
  import CallsRepository from '../repository/CallsRepository'

  const displayBar = ref(false)
  const calls = ref<{ name: string; fetchId: string }[]>([])
  const callRepo = new CallsRepository()
  const sidebarRef = ref<HTMLElement | null>(null)
  const sidebarBtnRef = ref<HTMLElement | null>(null)

  const emit = defineEmits<{
    (event: 'loadCall', id: string): void
  }>()

  const loadSavedCalls = () => {
    calls.value = callRepo.getAllCalls()
  }

  const openMenu = () => {
    displayBar.value = !displayBar.value
    if (displayBar.value) loadSavedCalls()
  }

  const deleteCall = (id: string) => {
    callRepo.deleteCallById(id)
    loadSavedCalls()
  }

  const onCallClick = (id: string) => {
    emit('loadCall', id)
    displayBar.value = false
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
      class="saved-calls-container absolute z-40"
      role="region"
      aria-label="Saved calls sidebar"
    >
      <h2 class="text-lg font-bold mb-2">Saved Calls</h2>
      <ul class="space-y-2">
        <li
          v-for="call in calls"
          :key="call.fetchId"
          class="p-2 saved-call"
        >
          <button
            @click="deleteCall(call.fetchId)"
            class="text-red-800 hover:text-red-500 cursor-pointer"
            aria-label="Delete saved call"
          >
            <i class="pi pi-trash text-xl" aria-hidden="true"></i>
          </button>
          <button
            @click="onCallClick(call.fetchId)"
            class="cursor-pointer w-full py-1 hover:text-gray-400 text-start"
            :aria-label="`Load saved call ${call.name}`"
          >
            {{ call.name }}
          </button>
        </li>
      </ul>
    </aside>
  </div>
</template>
<style scoped>
  @import "tailwindcss";

  .saved-calls-container {
    @apply w-screen max-w-screen h-screen top-0 flex flex-col gap-2 md:w-[720px] bg-stone-900 shadow pt-14 px-5;
  }

  .saved-call {
    @apply flex flex-row w-full gap-3 items-center justify-start;
  }
</style>
