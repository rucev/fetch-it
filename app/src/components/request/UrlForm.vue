<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import MethodSelector from './dropdownInputs/MethodSelector.vue'
  import { isValidHttpUrl } from '../../validators/options';

  const props = defineProps({
    modelValue: Object
  });
  const emit = defineEmits(['update:modelValue'])

  const local = computed({
    get: () => props.modelValue || {},
    set: value => emit('update:modelValue', value)
  })

  const isValid = ref<boolean | null>(null)
  const errorMessage = ref<string>('')

  watch(() => local.value.url, (newUrl) => {
    if (!newUrl) {
      isValid.value = null
      errorMessage.value = ''
      return
    }

    isValid.value = isValidHttpUrl(newUrl)
    errorMessage.value = isValid.value ? '' : 'Please enter a valid URL'
  })
</script>

<template>
<div class="flex flex-col gap-2 w-full">
  <label for="request-url" class="sr-only">Request URL</label>
  <div class="flex flex-row gap-2 w-full items-center">
    <MethodSelector v-model="local.method" />
    <input
      id="request-url"
      name="request-url"
      class="url"
      type="url"
      inputmode="url"
      autocomplete="url"
      v-model="local.url"
      :aria-invalid="isValid === false ? 'true' : 'false'"
      :class="{
        'border-red-500 focus:ring-red-500': isValid === false,
        'border-stone-600': isValid === null || isValid === true
      }"
      placeholder="http://localhost:5173/fetch-it"
      aria-describedby="url-error"
      aria-label="Request URL"
    />
  </div>
  <p v-if="!isValid && errorMessage" id="url-error" class="text-sm text-red-500 font-bold self-end">
    {{ errorMessage }}
  </p>
</div>

</template>

<style scoped>
@import "tailwindcss";

@layer components {
  .url {
    @apply w-full border-stone-600 border rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 sm:text-sm;
  }
}
</style>
