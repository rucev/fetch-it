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
      <button class="config-btn" @click="toggleDisplay">
        <i :class="['pi', isFormDisplayed ? 'pi-times': 'pi-cog']"></i>
      </button>
      <UrlForm :modelValue="urlFormData" @update:modelValue="val => emit('update:urlFormData', val)" />
    </div>
    <div v-show="isFormDisplayed" class="flex flex-col gap-2 w-full">
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
