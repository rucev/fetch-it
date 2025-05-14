<script setup lang="ts">
import { computed } from 'vue'
import MethodSelector from './buttons/MethodSelector.vue'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const local = computed({
  get: () => props.modelValue || {},
  set: value => emit('update:modelValue', value)
})
</script>

<template>
  <div class="flex flex-row gap-1 w-full">
    <MethodSelector v-model="local.method" />
    <input class="url" v-model="local.url" placeholder="http://localhost:4321/fetch-it" type="url" />
  </div>
</template>

<style scoped>
@import "tailwindcss";

@layer components {
  .url{
    @apply w-full border-stone-600 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
  }
}
</style>