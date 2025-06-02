<script setup lang="ts">
  import { computed } from 'vue'
  import type { BodyTypeOptions } from '../../interfaces/types'

  const props = defineProps<{ modelValue: BodyTypeOptions }>()
  const emit = defineEmits(['update:modelValue'])

  const selected = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
</script>
<template>
  <div class="flex flex-col gap-1">
    <label for="bodyTypeSelect" class="sr-only">
      Body Content Type
    </label>
    <select
      id="bodyTypeSelect"
      v-model="selected"
      class="dropdown"
      aria-label="Select body content type"
    >
      <option value="json">JSON</option>
      <option value="text">Text</option>
      <option value="xml">XML</option>
    </select>
  </div>
</template>
