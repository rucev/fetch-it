<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  curl?: string[] | string,
  onCloseCurl: Function,
}>()

const isArrayCurl = computed(() => Array.isArray(props.curl))
const curlArray = computed(() => (Array.isArray(props.curl) ? props.curl : [props.curl]))

const curlRef = ref<HTMLElement | null>(null)

const copyToClipboard = async () => {
  if (!curlRef.value) return

  const textToCopy = curlRef.value.innerText
  try {
    await navigator.clipboard.writeText(textToCopy)
    alert('cURL copied to clipboard!')
  } catch (err) {
    alert('Failed to copy.')
    console.error(err)
  }
}
</script>


<template>
  <div v-if="props.curl" class="fflex flex-col w-4/5 ">
    <div class="flex flex-row gap-2">
      <h3 class="text-2xl font-extrabold mb-2">cURL</h3>
      <button class="close-btn" @click="() => onCloseCurl()" >
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
        <button @click="copyToClipboard" class="copy-btn">
      <i class="pi pi-copy"></i>
    </button>
    </div>
  </div>
</template>
<style scoped>
@import "tailwindcss";

@layer components {
  .curl-container {
    @apply bg-stone-700 text-gray-50 max-h-96 w-fit max-w-full gap-5 overflow-auto px-4 py-2 mb-4 rounded flex flex-row
  }

  .copy-btn{
    @apply px-1 h-7 w-7 bg-stone-900 rounded text-white hover:bg-stone-600 text-sm cursor-pointer
  }

  .close-btn {
    @apply cursor-pointer hover:text-gray-400 px-2 py-1
  }

}
</style>
