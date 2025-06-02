<script setup lang="ts">
  const props = defineProps<{ 
    disabled: boolean
    onClick: () => void
    srOnly: string
    text: string
    iconClass: string
  }>()

  const handleClick = () => {
    if (!props.disabled) props.onClick()
  }
</script>
<template>
  <button
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
    @click="handleClick"
    :class="[
      'flex flex-row gap-2 bg-gray-300 text-stone-800 font-bold py-2 px-4 rounded items-center',
      props.disabled ? 'opacity-20 cursor-default' : 'hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer'
    ]"
    role="button"
    :tabindex="props.disabled ? -1 : 0"
    type="button"
  >
    <i :class="['text-xl pi', iconClass]" aria-hidden="true"></i>
    <span class="sr-only">{{ srOnly }}</span>
    <span aria-hidden="true">{{ text }}</span>
  </button>
</template>
