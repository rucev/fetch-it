<script setup lang="ts">
import { computed } from 'vue'
import type { ResponseToDisplay } from '../core/interfaces.ts'

const props = defineProps<{
  response?: ResponseToDisplay
}>()

const formattedBody = computed(() => {
  if (!props.response) return ''
  if (typeof props.response.body === 'object') {
    return JSON.stringify(props.response.body, null, 2)
  }
  return props.response.body
})

const statusClass = computed(() => {
  const code = props.response?.statusCode ?? 0
  if (code >= 200 && code < 300) return 'text-green-500'
  if (code >= 400 && code < 500) return 'text-red-500'
  if (code >= 500 && code < 600) return 'text-yellow-500'
  return 'text-gray-400'
})

</script>

<template>
  <div class="response-container" v-if="props.response">
    <div class="mb-4 flex flex-row justify-between items-center" >
      <h3 class="text-2xl font-extrabold mb-2">Response:</h3>
      <div class="flex flex-row gap-2 text-xl">
        <h4 class="font-bold">Status:</h4>
        <span :class="['font-bold', statusClass]">
          {{ props.response.statusCode }} - {{ props.response.statusMsg }}
        </span>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="font-bold text-xl">Headers:</h4>
      <ul class="headers-container mt-2">
        <li v-for="(header, index) in props.response.headers" :key="index">
          <b class="font-bold">{{ header.name }}:</b> {{ header.value }}
        </li>
      </ul>
    </div>

    <div>
      <h4 class="font-bold text-xl">Body:</h4>
      <div class="body-container mt-2">
        <pre>{{ formattedBody }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

@layer components {
  .response-container{
    @apply flex flex-col w-4/5 
  }
  .body-container {
    @apply bg-stone-700 text-gray-50 w-full max-h-96 overflow-auto px-4 py-2 rounded;
  }
  .headers-container {
    @apply bg-stone-700 text-gray-50 w-full max-h-96 overflow-auto px-4 py-2 rounded;
  }
}
</style>


