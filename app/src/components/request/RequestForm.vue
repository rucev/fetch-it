<script setup lang="ts">
  import { computed } from 'vue'
  import UrlForm from './UrlForm.vue'
  import HeadersForm from './HeadersForm.vue'
  import BodyForm from './BodyForm.vue'

  import { doesMethodAcceptBody } from '../../validators/options.ts'
  import type { HeaderRequest } from '../../interfaces/interfaces.ts'

  const props = defineProps<{
    urlFormData: Record<string, any>,
    headersFormData: HeaderRequest[],
    bodyFormData: any,
    isFormDisplayed: boolean
  }>()

  const emit = defineEmits([
    'update:urlFormData',
    'update:headersFormData',
    'update:bodyFormData',
    'update:isFormDisplayed',
  ])


  const methodAcceptsBody = computed(() =>
    doesMethodAcceptBody(props.urlFormData.method)
  )

  const toggleDisplay = () => {
    emit('update:isFormDisplayed', !props.isFormDisplayed)
  }
</script>
<template>
  <div class="flex flex-col justify-center items-center gap-5 w-full">
    <div class="w-full max-w-[720px] flex gap-4 flex-row">
      <button aria-controls="options-dropdown-form" aria-label="Toggle options form" class="config-btn" @click="toggleDisplay">
        <i :class="['pi', isFormDisplayed ? 'pi-times': 'pi-cog']"></i>
      </button>
      <UrlForm :modelValue="urlFormData" @update:modelValue="val => emit('update:urlFormData', val)" />
    </div>
    <div v-show="isFormDisplayed" class="flex flex-col gap-2 w-full" id="options-dropdown-form">
      <HeadersForm :modelValue="headersFormData" @update:modelValue="val => emit('update:headersFormData', val)" />
      <BodyForm
        v-if="methodAcceptsBody"
        :body="bodyFormData"
        :modelValue="bodyFormData"
        @update:modelValue="val => emit('update:bodyFormData', val)"
      />
    </div>
  </div>
</template>
<style>
    @import "tailwindcss";

    .config-btn {
      @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex items-center max-h-8.5
    }

    .dropdown {
      @apply border-stone-600 border-1 w-42 cursor-pointer flex flex-row justify-center items-center rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 placeholder:bg-stone-900 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
    }

    select option {
      @apply cursor-pointer bg-stone-900
    }
</style>
