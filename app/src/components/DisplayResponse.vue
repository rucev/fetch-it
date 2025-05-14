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
    <h3 class="text-lg font-semibold mb-2">Response:</h3>

    <div class="mb-4" >
      <h4 class="font-extrabold">Status:</h4>
        <p :class="['font-bold', statusClass]">
          {{ props.response.statusCode }} - {{ props.response.statusMsg }}
        </p>
    </div>

    <div class="mb-4">
      <h4 class="font-extrabold">Headers:</h4>
      <ul>
        <li v-for="(header, index) in props.response.headers" :key="index">
          {{ header.name }}: {{ header.value }}
        </li>
      </ul>
    </div>

    <div>
      <h4 class="font-extrabold">Body:</h4>
      <div class="body-container">
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
    @apply bg-stone-700 text-gray-50 w-full max-h-64 overflow-auto px-4 py-2 rounded;
  }
}
</style>


