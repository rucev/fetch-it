<script setup lang="ts">
  import OptionsBtn from './OptionsBtn.vue'
  const props = defineProps<{ 
    canSave: boolean
    submitFetch: () => void
    submitCurl: () => void
    saveCall: () => void
    resetCall: () => void
  }>()
</script>
<template>
  <div class="flex flex-row min-h-8 h-fit justify-center gap-2 flex-wrap">
    <OptionsBtn :disabled="!props.canSave" :onClick="props.submitFetch" text="Send" sr-only="Send API" icon-class="pi-send" />
    <OptionsBtn :disabled="!props.canSave" :onClick="props.submitCurl" text="cUrl" sr-only="Generate a cURL" icon-class="pi-code" />
    <OptionsBtn :disabled="!props.canSave" :onClick="props.saveCall" text="Save" sr-only="Save call data" icon-class="pi-save" />
    <OptionsBtn :disabled="!props.canSave" :onClick="props.resetCall" text="Reset Form" sr-only="Reset all inputs" icon-class="pi-refresh"/>
  </div>
</template>