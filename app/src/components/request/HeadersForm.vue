<script setup lang="ts">
  import { computed } from 'vue'
  import type { HeaderRequest } from '../../interfaces/interfaces'
  import HeadersNameSelector from './dropdownInputs/HeadersNameSelector.vue'
  import HeadersValueSelector from './dropdownInputs/HeadersValueSelector.vue'

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
    local.value = [
      ...local.value,
      {
        name: { content: '', isCustom: false },
        value: { content: '', isCustom: false },
      },
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
  <div class="flex flex-col gap-3 w-full px-5">
    <div
      v-for="(header, index) in local"
      :key="index"
      class="flex flex-row gap-2 items-center w-full"
    >
      <div class="flex-1 max-w-2/5">
        <label :for="`header-name-${index}`" class="sr-only">Header Name</label>
        <HeadersNameSelector
          :id="`header-name-${index}`"
          :modelValue="header.name"
          @update:modelValue="(value) => updateHeaderName(index, value)"
        />
      </div>
      <div class="flex-1 w-3/5">
        <label :for="`header-value-${index}`" class="sr-only">Header Value</label>
        <HeadersValueSelector
          :id="`header-value-${index}`"
          :headerName="header.name"
          :modelValue="header.value"
          @update:modelValue="(value) => updateHeaderValue(index, value)"
        />
      </div>
      <button
        @click="removeHeader(index)"
        type="button"
        class="text-red-700 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2 cursor-pointer"
        :aria-label="`Remove header ${index + 1}`"
      >
        <i class="pi pi-trash text-xl" aria-hidden="true"></i>
      </button>
    </div>
    <button
      @click="addHeader"
      type="button"
      class="btn"
      aria-label="Add a new HTTP header"
    >
      <i class="pi pi-plus mr-2" aria-hidden="true"></i>
      Add Header
    </button>
  </div>
</template>
<style scoped>
  @import "tailwindcss";

    input {
      @apply w-full border border-stone-600 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 sm:text-sm;
    }
    .btn {
      @apply cursor-pointer border-stone-600 hover:bg-stone-900 hover:border-stone-950 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 font-bold inline-flex items-center w-full md:max-w-80 text-left;
    }
</style>
