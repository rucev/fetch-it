<script setup lang="ts">
import { computed } from 'vue'
import type { HTTPMethod } from '../../interfaces/types';

const props = defineProps<{ modelValue: HTTPMethod }>()
const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <select v-model="selected" class="dropdown">
    <option value="GET">GET</option>
    <option value="POST">POST</option>
    <option value="PUT">PUT</option>
    <option value="DELETE">DELETE</option>
    <option value="PATCH">PATCH</option>
    <option value="HEAD">HEAD</option>
    <option value="OPTIONS">OPTIONS</option>
  </select>
</template>
