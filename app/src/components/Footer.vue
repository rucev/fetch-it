<template>
  <footer role="contentinfo" class="mt-5 pb-2 w-full px-4 flex flex-col items-center">
    <hr class="w-4/5 border-0 h-0.5 bg-stone-900 my-2" />
    <div class="flex items-center justify-center md:justify-between w-full flex-col md:flex-row">
      <a class="text-stone-400" href="https://github.com/rucev/fetch-it" target="_blank" rel="noopener" aria-label="Open Fetch It GitHub repository in a new tab">
        <i aria-hidden="true" class="pi pi-github text-xl"></i>
        Fetch It Code
      </a>
      <div class="w-full justify-center items-center flex flex-col">
        <p class="text-stone-200 text-xs md:text-sm font-bold">This tool is fully client-side. No data is sent or stored externally.</p>
        <p class="text-stone-400 text-xs md:text-sm italic">unless that's exactly what your API call is trying to do</p>
      </div>
      <div class="flex flex-row items-center justify-end gap-0.5 w-fit text-stone-500">
        <a  href="https://github.com/rucev" target="_blank" rel="noopener" aria-label="Open Flors Rueda GitHub profile in a new tab">
          <i aria-hidden="true" class="pi pi-github text-xl"></i>
        </a>
        <a  href="https://www.linkedin.com/in/flors-rueda" target="_blank" rel="noopener" aria-label="Open Flors Rueda Linkedin profile in a new tab">
          <i aria-hidden="true" class="pi pi-linkedin text-xl"></i>
        </a>
        <a  href="https://flors.rucev.com/" target="_blank" rel="noopener" aria-label="Open Flors Rueda personal website in a new tab">
          <i aria-hidden="true" class="pi pi-home text-xl"></i>  
        </a>
        <span class="pl-2 text-stone-400">hi@rucev.com</span>
      </div>
    </div>
  </footer>
</template>
<style scoped>
  @import "tailwindcss";

  a {
    @apply cursor-pointer hover:text-stone-200 flex flex-row gap-2 items-center min-w-fit px-2 py-1
  }

</style>
