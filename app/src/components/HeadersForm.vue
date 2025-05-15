<script setup lang="ts">
import { computed } from 'vue'
import type { Header } from '../core/interfaces' // Adjust path as needed

const props = defineProps<{
  modelValue: Header[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Header[]): void
}>()

const local = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const addHeader = () => {
  local.value.push({ name: '', value: '' })
}

const removeHeader = (index: number) => {
  local.value.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="(header, index) in local" :key="index" class="flex flex-row gap-2 items-center">
      <input
        v-model="header.name"
        placeholder="Header Name"
        class="px-2 py-1 rounded bg-stone-800 text-white"
      />
      <input
        v-model="header.value"
        placeholder="Header Value"
        class="px-2 py-1 rounded bg-stone-800 text-white"
      />
      <button @click="removeHeader(index)" class="text-red-800 hover:text-red-500"><i class="pi pi-trash text-xl"></i></button>
    </div>
    <button @click="addHeader" class="bg-stone-500 hover:bg-stone-700 text-stone-50 font-bold py-2 px-4 rounded inline-flex items-center w-full md:w-1/3">+ Add Header</button>
  </div>
</template>
<style scoped>
  @import "tailwindcss";

  @layer components {
    input{
      @apply w-full border-stone-600 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
    }

    button{
      cursor: pointer;
    }
  }
</style>