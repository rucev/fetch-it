<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { HEADER_VALUES } from '../../constants/headerValues'

const props = defineProps<{
  modelValue: string,
  headerName: string | undefined
}>()

const localValue = ref(props.modelValue)
const isCustom = ref(false)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

const emit = defineEmits<{
  (event: 'update:modelValue', val: string): void
}>()

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.headerName, (newName) => {
  let defaultVal;
  if(newName) defaultVal = HEADER_VALUES[newName]
  if (typeof defaultVal === 'string') {
    localValue.value = ''
    isCustom.value = true
  } else if (Array.isArray(defaultVal) && defaultVal.length > 0) {
    localValue.value = defaultVal[0]
    isCustom.value = false
  } else {
    localValue.value = ''
    isCustom.value = false
  }
}, { immediate: true })

const defaultValues = computed(() => {
  let values: string | string[]
  if(props.headerName) values = HEADER_VALUES[props.headerName]
  else values = 'Set your header value here'
  return values
})

const toggleInputMode = () => {
  if (isCustom.value === true) localValue.value = ''
  isCustom.value = !isCustom.value
}
</script>

<template>
  <div class="flex flex-col gap-2 w-1/2">
    <div v-if="!isCustom && Array.isArray(defaultValues)" class="flex gap-2">
      <button type="button" @click="toggleInputMode" class="btn">
        <i class="pi pi-pen-to-square text-xl"></i>
      </button>
      <select v-model="localValue" class="dropdown">
        <option disabled value="">Select a value</option>
        <option v-for="(val, index) in defaultValues" :key="index" :value="val">{{ val }}</option>
      </select>
    </div>

    <div v-else class="flex gap-2">
      <button v-if="Array.isArray(defaultValues)" type="button" @click="toggleInputMode" class="btn">
        <i class="pi pi-chevron-circle-down text-xl"></i>
      </button>
      <input
        type="text"
        v-model="localValue"
        :placeholder="typeof defaultValues === 'string' ? defaultValues : 'Set your header value here'"
        class="input"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "tailwindcss";

  @layer components {
    .dropdown {
      @apply w-full py-2
    }

    input {
      @apply w-full border-stone-600 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
    }

    button{
      cursor: pointer;
    }
  }
</style>