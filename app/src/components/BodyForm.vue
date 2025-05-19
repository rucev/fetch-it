<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BodyTypeSelector from './inputs/BodyTypeSelector.vue'
import type { BodyTypeOptions } from '../interfaces/types'
import { isValidBody } from '../validators/options';

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | object | undefined): void
}>()

const isBodyActive = ref<boolean>(false)
const selectedBodyType = ref<BodyTypeOptions>('json')
const inputText = ref<string>('')
const isValid = ref<boolean | null>(null)
const errorMessage = ref<string>('')

const validateSyntax = (text: string, type: BodyTypeOptions): [boolean | null, string?] => {
  if (!text.trim()) return [null]

  try {
    const isValid = isValidBody(text, type, undefined)
    return [isValid]
  } catch (error: any) {
    return [false, error.message || 'Invalid syntax']
  }
}

const validateAndEmit = () => {
  const [valid, message] = validateSyntax(inputText.value, selectedBodyType.value)
  isValid.value = valid
  errorMessage.value = valid ? '' : message || 'Invalid format'

  if (!valid) return

  if (selectedBodyType.value === 'json') {
    try {
      emit('update:modelValue', {content: JSON.parse(inputText.value), type: 'json'})
    } catch {
      emit('update:modelValue', undefined)
    }
  } else {
    emit('update:modelValue', {content: inputText.value, type: selectedBodyType.value})
  }
}

watch([inputText, selectedBodyType], validateAndEmit)

const placeholderText = computed(() => {
  switch (selectedBodyType.value) {
    case 'json':
      return '{\n  "key": "value"\n}'
    case 'xml':
      return `<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>API</to>\n  <from>Fetch It</from>\n</note>`
    case 'text':
    default:
      return 'Write plain text here...'
  }
})
</script>

<template>
  <button v-if="!isBodyActive" @click="isBodyActive = true" class="btn"  >
    + Add Body
  </button>
  <div v-if="isBodyActive" class="flex flex-col gap-2 w-full">
    <div class="flex justify-between items-center gap-5">
      <BodyTypeSelector v-model="selectedBodyType" />
      <button @click="isBodyActive = false" class="btn">
        - Remove Body
      </button>
    </div>
    <textarea
      v-model="inputText"
      rows="10"
      class="bg-stone-800 text-stone-100 p-2 rounded-md border outline-none font-mono"
      :class="{
        'border-green-500': isValid === true,
        'border-red-500': isValid === false,
        'border-stone-600': isValid === null
      }"
      :placeholder="placeholderText"
    ></textarea>

    <p v-if="!isValid" class="text-red-500 text-sm font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>
<style scoped>
@import "tailwindcss";

@layer components {
  .btn {
    @apply cursor-pointer bg-stone-500 hover:bg-stone-700 text-stone-50 font-bold py-2 px-4 rounded inline-flex items-center w-full md:w-1/3
  }

}
</style>