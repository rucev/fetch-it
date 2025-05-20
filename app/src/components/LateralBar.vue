<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CallsRepository from '../repository/CallsRepository';

const displayBar = ref<boolean>(false)

const calls = ref<{name: string, fetchId: string}[]>([])

const callRepo = new CallsRepository()

const loadSavedCalls = () => {
  calls.value = callRepo.getAllCalls()
}

onMounted(() => {
  loadSavedCalls()
})

const emit = defineEmits<{
  (event: 'loadCall', id: string): void
}>()

const openMenu = () => {
    displayBar.value = !displayBar.value
    if(displayBar.value) loadSavedCalls()
}


const deleteCall = (id: string) => {
    callRepo.deleteCallById(id)
    loadSavedCalls()
} 

const onCallClick = (id: string) => {
    emit('loadCall', id)
    displayBar.value = !displayBar.value
}

</script>

<template>
    <div class="absolute z-40 top-0 left-0">
    <button class="z-50 absolute top-2 left-2 cursor-pointer p-3 text-stone-200 hover:text-stone-500" @click="openMenu">
        <i :class="['pi text-2xl', displayBar ? 'pi-times': 'pi-list']"></i>
    </button>
    <div v-if="displayBar" class="saved-calls-container absolute z-40">
        <h2 class="text-lg font-bold mb-2">Saved Calls</h2>
        <ul class="space-y-2">
            <li v-for="call in calls" :key="call.fetchId" class="p-2 saved-call" >
                <button @click="deleteCall(call.fetchId)" class="text-red-800 hover:text-red-500 cursor-pointer">
                    <i class="pi pi-trash text-xl"></i>
                </button>
                <button @click="onCallClick(call.fetchId)" class="cursor-pointer w-full py-1 hover:text-gray-400 text-start">
                    {{ call.name }}     
                </button>                   
            </li>
        </ul>
    </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

@layer components {
    .saved-calls-container {
        @apply w-screen max-w-screen h-screen top-0 flex flex-col gap-2 md:w-[720px] bg-stone-900 shadow pt-14 px-5
    }
    .saved-call {
        @apply flex flex-row w-full gap-3 items-center justify-start
    }
}
</style>
