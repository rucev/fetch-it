<script setup lang="ts">
import { ref } from 'vue'
import UrlForm from './components/UrlForm.vue'
import HeadersForm from './components/HeadersForm.vue'
import DisplayResponse from './components/DisplayResponse.vue'
import { callFetch } from './core/fetchIt.ts'
import type { Header, Options, ResponseToDisplay } from './core/interfaces.ts'
import Send from './components/buttons/Send.vue'
import GeneratecURL from './components/buttons/GeneratecURL.vue'
import { generateCurl } from './core/generateCurl.ts'
import DisplayCurl from './components/DisplayCurl.vue'

const urlFormData = ref<Record<string, any>>({method: 'GET'})
const headersFormData = ref<Header[]>([])
const responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
const generatedCurl = ref<string[] | string | undefined>(undefined)
const isFormDisplayed = ref<boolean>(false)
const display = ref<string>('response')

const handleConfigBtnClick = () => {
  isFormDisplayed.value = !isFormDisplayed.value
}

const getFormData = (): Options => {
  const headers: Header[] = headersFormData.value
    .filter(header => header.name && header.value)
    .map(header => ({ name: header.name, value: header.value }))

    const options: Options = {
      url: urlFormData.value.url,
      method: urlFormData.value.method,
      headers,
    }

    return options
}

const submitFetch = async () => {
  isFormDisplayed.value = false
  display.value = 'response'

  try {
    const options = getFormData()

    const response = await callFetch(options)
    responseToDisplay.value = response
  } catch (error: any) {
    responseToDisplay.value = error.message
  }
}

const submitCurl = () => {
  isFormDisplayed.value = false
  display.value = 'curl'

  try {
    const options = getFormData()

    generatedCurl.value = generateCurl(options, true)

  } catch (error: any) {
    generatedCurl.value = error.message
  }
}

</script>

<template>
  <main>
    <h1>Fetch It</h1>
    <div class="flex flex-row h-8 gap-2">
      <Send @click="submitFetch" />
      <GeneratecURL @click="submitCurl" />
    </div>
    <div class="flex flex-col gap-5 w-full px-7">
      <div class="w-full flex gap-4 flex-row">
        <button class="configBtn" @click="handleConfigBtnClick" >
          <i :class="['pi', isFormDisplayed ? 'pi-times': 'pi-cog']"></i>
        </button>
        <UrlForm v-model="urlFormData" />
      </div>
        <div v-if="isFormDisplayed" >
          <HeadersForm v-model="headersFormData" />
        </div>
    </div>
    <span class="w-4/5 h-0.5 bg-stone-900"></span>
    <div>
    </div>
    <DisplayCurl v-if="display === 'curl'" :curl="generatedCurl" />
    <DisplayResponse v-if="display === 'response'" :response="responseToDisplay" />
  </main>
</template>

<style>
@import "tailwindcss";

@layer base {
  main {
    @apply bg-stone-800 text-gray-50 flex flex-col gap-5 overflow-y-hidden items-center max-w-screen overflow-hidden min-h-screen pt-7
  }

  h1 {
    @apply text-7xl font-extrabold
  }
}

@layer components {
  .configBtn {
    @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex items-center
  }
}

</style>
