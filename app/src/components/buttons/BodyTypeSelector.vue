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

<style scoped>
@import "tailwindcss";

@layer components {
  .dropdown{
    @apply border-stone-600 border-1 w-42 cursor-pointer flex flex-row justify-center items-center rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 placeholder:bg-stone-900 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
  }

  select option{
    @apply cursor-pointer bg-stone-900
  }
}
</style>