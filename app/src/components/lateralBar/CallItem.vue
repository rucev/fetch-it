<script setup lang="ts">
  import CallsRepository from '../../repository/CallsRepository'

  const props = defineProps<{ 
    call: {name: string, fetchId: string},
    onCallClick: Function,
    onCallDelete: Function,
  }>()

  const callRepo = new CallsRepository()

  const deleteCall = () => {
    callRepo.deleteCallById(props.call.fetchId)
    props.onCallDelete()
  }

</script>
<template>
      <button
            @click="deleteCall"
            class="text-red-800 hover:text-red-500 cursor-pointer"
            aria-label="Delete saved call"
          >
            <i class="pi pi-trash text-xl" aria-hidden="true"></i>
          </button>
          <button
            @click="() => onCallClick(call.fetchId)"
            class="cursor-pointer w-full py-1 hover:text-gray-400 text-start"
            :aria-label="`Load saved call ${call.name}`"
          >
            {{ call.name }}
          </button>
</template>
