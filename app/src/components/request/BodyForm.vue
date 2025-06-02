<script setup lang="ts">
  import { computed, ref, watch, onMounted } from 'vue'
  import BodyTypeSelector from './dropdownInputs/BodyTypeSelector.vue'
  import type { BodyTypeOptions } from '../../interfaces/types'
  import { isValidBody } from '../../validators/options'
  import type { BodyInfo } from '../../interfaces/interfaces'

  const props = defineProps<{
    body: BodyInfo | undefined
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: string | object | undefined): void
  }>()

  const isBodyActive = ref(false)
  const selectedBodyType = ref<BodyTypeOptions>('json')
  const inputText = ref('')
  const isValid = ref<boolean | null>(null)
  const errorMessage = ref('')

  onMounted(() => {
    if (props.body?.content) {
      inputText.value = typeof props.body.content === 'object'
        ? JSON.stringify(props.body.content, null, 2)
        : props.body.content

      selectedBodyType.value = props.body.type || 'json'
      isBodyActive.value = true
    }
  })

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

    if (!valid) return;

    if (selectedBodyType.value === 'json') {
      try {
        emit('update:modelValue', { content: JSON.parse(inputText.value), type: 'json' })
      } catch {
        emit('update:modelValue', undefined)
      }
    } else {
      emit('update:modelValue', { content: inputText.value, type: selectedBodyType.value })
    }
  }

  watch([inputText, selectedBodyType], validateAndEmit)

  const placeholderText = computed(() => {
    switch (selectedBodyType.value) {
      case 'json':
        return '{\n  "key": "value"\n}'
      case 'xml':
        return `<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>API</to>\n  <from>Fetch It</from>\n</note>`
      default:
        return 'Write plain text here...'
    }
  })
</script>
<template>
  <div class="p-5 flex flex-col w-full">
    <button
    v-if="!isBodyActive"
    @click="isBodyActive = true"
    class="btn"
    type="button"
    aria-label="Add request body"
  >
    <i class="pi pi-plus pr-2"></i> Add Body
  </button>
  <div v-if="isBodyActive" class="flex flex-col gap-2 w-full">
    <div class="flex justify-between items-center gap-5">
      <BodyTypeSelector v-model="selectedBodyType" />
      <button
        @click="isBodyActive = false"
        class="btn"
        type="button"
        aria-label="Remove request body"
      >
        <i class="pi pi-times pr-2"></i> Remove Body
      </button>
    </div>
    <label for="request-body" class="sr-only">
      Request Body Input ({{ selectedBodyType.toUpperCase() }})
    </label>
    <textarea
      id="request-body"
      v-model="inputText"
      rows="10"
      :aria-invalid="isValid === false"
      class="bg-stone-800 text-stone-100 p-2 rounded-md border outline-none font-mono"
      :class="{
        'border-red-500': isValid === false,
        'border-stone-600': isValid === null || isValid === true
      }"
      :placeholder="placeholderText"
    ></textarea>
    <p
      v-if="isValid === false"
      class="text-red-500 text-sm font-medium"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>

  </div>
</template>
<style scoped>
  @import "tailwindcss";

  .btn {
    @apply cursor-pointer border-stone-600 hover:bg-stone-900 hover:border-stone-950 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 font-bold inline-flex items-center w-full md:max-w-80 text-left;
  }
</style>
