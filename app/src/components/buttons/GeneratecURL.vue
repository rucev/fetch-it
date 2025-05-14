<template>
    <button class="flex flex-row gap-2">
        <i class="pi pi-code text-xl"></i>
        <span>cURL</span>
    </button>
</template>
<style scoped>
    @import "tailwindcss";

    @layer components {
    button {
        @apply cursor-pointer bg-gray-300 hover:bg-gray-400 text-stone-800 font-bold py-2 px-4 rounded inline-flex items-center
    }
    }
</style>