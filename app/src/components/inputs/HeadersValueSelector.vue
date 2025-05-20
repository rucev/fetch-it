<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { HEADER_VALUES } from '../../constants/headerValues'

  const props = defineProps<{
    modelValue: { isCustom: boolean; content: string },
    headerName: { isCustom: boolean; content: string } | undefined
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', val: { isCustom: boolean; content: string }): void
  }>()

  const isCustom = ref<boolean>(props.modelValue.isCustom ? true : false)
  const localValue = ref<string>(props.modelValue.content)

  watch(() => props.modelValue, (val) => {
    localValue.value = val.content
    isCustom.value = val.isCustom
  })

  watch([localValue, isCustom], () => {
    emit('update:modelValue', {
      content: localValue.value,
      isCustom: isCustom.value,
    })
  })

  const defaultValues = computed(() => {
    if (props.headerName?.content) {
      return HEADER_VALUES[props.headerName.content]
    }
    return 'Set your header value here'
  })

  watch(() => props.headerName?.content, (newName) => {
    const defaultVal = newName ? HEADER_VALUES[newName] : undefined

    if (typeof defaultVal === 'string') {
      localValue.value = props.modelValue.content ? props.modelValue.content : ''
      isCustom.value = true
    } else if (Array.isArray(defaultVal) && defaultVal.length > 0) {
      localValue.value = defaultVal[0]
      isCustom.value = false
    } else {
      localValue.value = props.modelValue.content ? props.modelValue.content : ''
      isCustom.value = true
    }
  }, { immediate: true })

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

  .dropdown {
    @apply w-full py-2
  }

  input {
    @apply w-full border-stone-600 border-1 rounded-md py-1.5 pr-7 pl-3 text-base text-stone-200 placeholder:text-stone-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-950 sm:text-sm/6
  }

  button{
    cursor: pointer;
  }
</style>
