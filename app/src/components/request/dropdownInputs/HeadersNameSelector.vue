<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { HEADER_NAMES } from '../../../constants/headerNames'

  const emit = defineEmits(['update:modelValue'])
  const props = defineProps<{ modelValue: { isCustom: boolean; content: string } }>()

  const isCustom = ref<boolean>(props.modelValue.isCustom || false)
  const localValue = ref<string>(props.modelValue.content)

  watch([localValue, isCustom], () => {
    emit('update:modelValue', {
      content: localValue.value,
      isCustom: isCustom.value,
    })
  })

  const selected = computed({
    get: () => localValue.value,
    set: (value) => (localValue.value = value),
  })

  const toggleInputMode = () => {
    isCustom.value = !isCustom.value
  }
</script>
<template>
  <div class="flex flex-col gap-2">
    <div v-if="!isCustom" class="flex gap-2 items-center">
      <button
        type="button"
        @click="toggleInputMode"
        class="btn"
        aria-label="Switch to custom header input"
        title="Switch to custom input"
      >
        <i class="pi pi-pen-to-square text-xl" aria-hidden="true"></i>
      </button>

      <div class="w-full">
        <label for="header-select" class="sr-only">Select a predefined header</label>
        <select
          id="header-select"
          v-model="selected"
          class="dropdown"
          aria-label="Predefined HTTP header name"
        >
          <option disabled value="">Select a header</option>
          <option v-for="(name, index) in HEADER_NAMES" :key="index" :value="name">
            {{ name }}
          </option>
        </select>
      </div>
    </div>

    <div v-else class="flex gap-2 items-center">
      <button
        type="button"
        @click="toggleInputMode"
        class="btn"
        aria-label="Switch to predefined header select"
        title="Switch to select input"
      >
        <i class="pi pi-chevron-circle-down text-xl" aria-hidden="true"></i>
      </button>

      <div class="w-full">
        <label for="custom-header" class="sr-only">Custom header name</label>
        <input
          id="custom-header"
          type="text"
          v-model="selected"
          placeholder="Enter custom header name"
          class="input"
          aria-label="Custom HTTP header name"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "tailwindcss";

.dropdown {
  @apply w-full py-2 border border-stone-600 rounded-md  text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-950;
}

.input {
  @apply w-full border border-stone-600 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 sm:text-sm;
}

.btn {
  @apply text-stone-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-500 rounded p-2 cursor-pointer
}
</style>
