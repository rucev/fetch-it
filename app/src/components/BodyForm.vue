<script setup lang="ts">
import { computed } from 'vue'


const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const local = computed({
  get: () => props.modelValue || {},
  set: value => emit('update:modelValue', value)
})
</script>

<template>
  <div>
    <input v-model="local.body" placeholder="Your body in JSON" />
  </div>
</template>
