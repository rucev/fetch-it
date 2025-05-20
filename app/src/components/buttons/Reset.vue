<script setup lang="ts">
    const props = defineProps<{ 
        disabled: boolean;
        onClick: () => void 
    }>()

    const handleClick = () => {
        if(!props.disabled) props.onClick()
    }

</script>
<template>
    <button :disabled="props.disabled" :aria-disabled="props.disabled" @click="handleClick"
    :class="[props.disabled ? 'opacity-20 cursor-default' : 'cursor-pointer hover:bg-gray-400']">
        <i class="pi pi-refresh text-xl"></i>
        <span>Reset Form</span>
    </button>
</template>
<style scoped>
    @import "tailwindcss";

    button {
        @apply flex flex-row gap-2 bg-gray-300 text-stone-800 font-bold py-2 px-4 rounded items-center
    }
</style>