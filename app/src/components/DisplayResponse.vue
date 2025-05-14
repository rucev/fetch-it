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
</script>

<template>
  <div v-if="props.response">
    <h3 class="text-lg font-semibold mb-2">Response:</h3>

    <div class="mb-4">
      <h4 class="font-bold">Status:</h4>
      <p>{{ props.response.statusCode }} - {{ props.response.statusMsg }}</p>
    </div>

    <div class="mb-4">
      <h4 class="font-bold">Headers:</h4>
      <ul>
        <li v-for="(header, index) in props.response.headers" :key="index">
          {{ header.name }}: {{ header.value }}
        </li>
      </ul>
    </div>

    <div>
      <h4 class="font-bold">Body:</h4>
      <pre>{{ formattedBody }}</pre>
    </div>
  </div>
</template>
