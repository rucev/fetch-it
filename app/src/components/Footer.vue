<template>
    <footer class="mt-5 pb-2 w-full h-10">
        <span class="w-4/5 h-0.5 bg-stone-900"></span>
        <div class="flex flex-row w-full items-center">
            <a class="repository-link" href="https://github.com/rucev/fetch-it" target="_blank" rel="noopener">
                <i class="pi pi-github"></i>Fetch It Code
            </a>
        </div>
    </footer>
</template>
<style scoped>
    @import "tailwindcss";

    @layer components {
        .repository-link {
            @apply cursor-pointer hover:text-stone-500 text-stone-600 flex flex-row gap-2 items-center
        }
    }
</style>