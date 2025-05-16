<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { HEADER_NAMES } from '../../core/constants/headerNames'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: string }>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

const isCustom = ref(false)

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const toggleInputMode = () => {
  isCustom.value = !isCustom.value
}
</script>

<template>
  <div class="flex flex-col gap-2 w-1/2">
    <div v-if="!isCustom" class="flex gap-2">
      <button type="button" @click="toggleInputMode" class="btn">
        <i class="pi pi-pen-to-square text-xl"></i>
      </button>
      <select v-model="selected" class="dropdown">
        <option disabled value="">Select a header</option>
        <option v-for="(name, index) in HEADER_NAMES" :key="index" :value="name">{{ name }}</option>
      </select>
    </div>

    <div v-else class="flex gap-2">
      <button type="button" @click="toggleInputMode" class="btn">
        <i class="pi pi-chevron-circle-down text-xl"></i>
      </button>
      <input
        type="text"
        v-model="selected"
        placeholder="Enter custom header name"
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