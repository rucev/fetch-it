<script setup lang="ts">
  import { computed } from 'vue'
  import type { HeaderRequest } from '../interfaces/interfaces'
  import HeadersNameSelector from './inputs/HeadersNameSelector.vue'
  import HeadersValueSelector from './inputs/HeadersValueSelector.vue'

  const props = defineProps<{
    modelValue: HeaderRequest[]
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: HeaderRequest[]): void
  }>()

  const local = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  })

  const addHeader = () => {
    local.value = [...local.value,
      {
        name: { content: '', isCustom: false },
        value: { content: '', isCustom: false }
      }
    ]
  }

  const removeHeader = (index: number) => {
    local.value = local.value.filter((_, i) => i !== index)
  }

  const updateHeaderName = (index: number, newName: { content: string; isCustom: boolean }) => {
    const updated = [...local.value]
    updated[index] = { ...updated[index], name: newName }
    local.value = updated
  }

  const updateHeaderValue = (index: number, newValue: { content: string; isCustom: boolean }) => {
    const updated = [...local.value]
    updated[index] = { ...updated[index], value: newValue }
    local.value = updated
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="(header, index) in local" :key="index" class="flex flex-row gap-2 items-center">
      <HeadersNameSelector
        :modelValue="header.name"
        @update:modelValue="(value) => updateHeaderName(index, value)"
      />
      <HeadersValueSelector
        :headerName="header.name"
        :modelValue="header.value"
        @update:modelValue="(value) => updateHeaderValue(index, value)"
      />
      <button @click="removeHeader(index)" class="text-red-800 hover:text-red-500">
        <i class="pi pi-trash text-xl"></i>
      </button>
    </div>
    <button
      @click="addHeader"
      class="bg-stone-500 hover:bg-stone-700 text-stone-50 font-bold py-2 px-4 rounded inline-flex items-center w-full md:w-1/3"
    >
      + Add Header
    </button>
  </div>
</template>

<style scoped>
  @import "tailwindcss";

  input{
    @apply w-full border-stone-600 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
  }

  button{
    cursor: pointer;
  }
</style>