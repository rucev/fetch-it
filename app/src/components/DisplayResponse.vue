<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ResponseToDisplay } from '../interfaces/interfaces.ts'

const props = defineProps<{ response?: ResponseToDisplay }>()

const displayResponse = ref(true)

const formattedBody = computed(() => {
  if (!props.response) return ''
  return typeof props.response.body === 'object'
    ? JSON.stringify(props.response.body, null, 2)
    : props.response.body
})

const statusClass = computed(() => {
  const code = props.response?.statusCode ?? 0
  if (code >= 200 && code < 300) return 'text-green-500'
  if (code >= 400 && code < 500) return 'text-red-500'
  if (code >= 500 && code < 600) return 'text-yellow-500'
  return 'text-gray-400'
})

const toggleLabel = computed(() => displayResponse.value ? 'Hide response details' : 'Show response details')
</script>
<template>
  <div class="w-full flex flex-col px-10" aria-live="polite">
    <div v-if="props.response" class="mb-4 flex flex-row justify-between items-center">
      <h3 id="response-title" class="text-2xl font-extrabold mb-2">Response:</h3>
      <div class="flex flex-row gap-2 text-xl" role="status" aria-live="polite">
        <h4 class="font-bold">Status:</h4>
        <span :class="['font-bold', statusClass]">
          {{ props.response.statusCode }} - {{ props.response.statusMsg }}
        </span>
      </div>
    </div>
    <button
        class="response-btn"
        @click="displayResponse = !displayResponse"
        :aria-expanded="displayResponse.toString() ? true : false"
        aria-controls="response-details"
        :aria-label="toggleLabel"
    >
      <i :class="['pi', displayResponse ? 'pi-eye-slash' : 'pi-eye']" aria-hidden="true"></i>
      {{ displayResponse ? 'Hide' : 'Show More' }}
    </button>
  </div>
  <section
    v-if="displayResponse && props.response"
    id="response-details"
    class="response-container"
    aria-labelledby="response-title"
  >
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
  </section>
</template>
<style scoped>
  @import "tailwindcss";
  
  .response-btn {
    @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex flex-row items-center self-start gap-2
  }
  
  .response-container {
    @apply flex flex-col w-4/5
  }

  .body-container,
  .headers-container {
    @apply bg-stone-700 text-gray-50 w-full max-h-96 overflow-auto px-4 py-2 rounded
  }
</style>
