<script setup lang="ts">
const props = defineProps<{
  curl?: string[] | string
}>()

</script>

<template>
  <div v-if="props.curl">
    <h3 class="text-lg font-semibold mb-2">cURL:</h3>
    <div class="mb-4">
      <ul>
        <li v-for="(line, index) in props.curl" :key="index">
          {{ line }}
        </li>
      </ul>
    </div>
  </div>
</template>
