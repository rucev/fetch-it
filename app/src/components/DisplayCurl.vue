<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  curl?: string[] | string
  onCloseCurl: () => void
}>()

const isArrayCurl = computed(() => Array.isArray(props.curl))
const curlArray = computed(() => (Array.isArray(props.curl) ? props.curl : [props.curl]))

const curlRef = ref<HTMLElement | null>(null)
const isCopied = ref(false)

const copyToClipboard = async () => {
  if (!curlRef.value) return
  try {
    await navigator.clipboard.writeText(curlRef.value.textContent)
    isCopied.value = true
    setTimeout(() => isCopied.value = false, 1000)
  } catch (error) {
    console.error('Failed to copy text:', error)
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') props.onCloseCurl()
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
<template>
  <div v-if="props.curl" class="fixed inset-0 h-screen w-screen flex items-center justify-center z-40" role="dialog"
    aria-modal="true" aria-labelledby="curl">
    <div
      class="bg-stone-700 text-gray-50 max-h-4/5 min-w-1/2 w-fit max-w-4/5 flex flex-col shadow-2xl rounded-sm py-2 px-3">
      <div class="flex flex-row gap-2 w-full justify-between">
        <h3 class="text-2xl font-extrabold mb-2">cURL</h3>
        <button class="close-btn" @click="() => onCloseCurl()" aria-label="Close cURL dialog">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div class="curl-container">
        <div ref="curlRef">
          <ul v-if="isArrayCurl">
            <li v-for="(line, index) in curlArray" :key="index">
              {{ line }}
            </li>
          </ul>
          <pre v-else>{{ props.curl }}</pre>
        </div>
      </div>
      <div class="self-end fixed mt-12 mr-5 flex flex-col items-center group" aria-live="assertive">
        <button @click="copyToClipboard" class="copy-btn" aria-label="Copy cURL to clipboard">
          <i class="pi pi-copy"></i>
        </button>
        <div class="fixed mt-8 flex-col items-center hidden mb-5 group-hover:flex">
          <div class="w-3 h-3 rotate-405 bg-stone-950"></div>
          <span
            class="-mt-2 relative rounded-md z-10 p-4 text-xs leading-none text-stone-50 whitespace-no-wrap bg-stone-950 shadow-lg">
            {{ isCopied ? 'Copied!' : 'Copy cURL to clipboard' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "tailwindcss";

.curl-container {
  @apply bg-stone-800 w-full gap-5 overflow-auto pl-4 pr-18 py-2 mb-4 rounded flex flex-row justify-between
}

.copy-btn {
  @apply px-1 h-7 w-7 bg-stone-900 rounded text-white hover:bg-stone-600 text-sm cursor-pointer
}

.close-btn {
  @apply cursor-pointer hover:text-gray-400 px-2 py-1
}
</style>
