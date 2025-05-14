<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  curl?: string[] | string
}>()

// Compute if curl is an array and return it
const isArrayCurl = computed(() => Array.isArray(props.curl))
const curlArray = computed(() => (Array.isArray(props.curl) ? props.curl : [props.curl]))
</script>

<template>
  <div v-if="props.curl">
    <h3 class="text-lg font-semibold mb-2">cURL:</h3>
    <div class="mb-4">
      <ul v-if="isArrayCurl">
        <li v-for="(line, index) in curlArray" :key="index">
          {{ line }}
        </li>
      </ul>
      <pre v-else>{{ props.curl }}</pre>
    </div>
  </div>
</template>
