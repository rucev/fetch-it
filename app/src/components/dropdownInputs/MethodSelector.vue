<script setup lang="ts">
import { computed } from 'vue'
import type { HTTPMethod } from '../../interfaces/types'

const props = defineProps<{ modelValue: HTTPMethod }>()
const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label for="http-method" class="sr-only">HTTP Method</label>
    <select
      id="http-method"
      name="http-method"
      v-model="selected"
      class="dropdown"
      aria-label="Select HTTP method"
    >
      <option disabled value="">Select method</option>
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
      <option value="PATCH">PATCH</option>
      <option value="HEAD">HEAD</option>
      <option value="OPTIONS">OPTIONS</option>
    </select>
  </div>
</template>
