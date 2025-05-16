<script setup lang="ts">
import { computed } from 'vue'
import type { BodyTypeOptions } from '../../core/interfaces';

const props = defineProps<{ modelValue: BodyTypeOptions }>()
const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <select v-model="selected" class="dropdown">
    <option value="json">JSON</option>
    <option value="text">Text</option>
    <option value="xml">XML</option>
  </select>
</template>
