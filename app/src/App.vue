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
const headersFormData = ref<{ headerName?: string; headerValue?: string }>({})
const responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
const generatedCurl = ref<string[] | string | undefined>(undefined)

const getFormData = (): Options => {
    const headers: Header[] = []

    if (headersFormData.value.headerName && headersFormData.value.headerValue) {
      headers.push({
        name: headersFormData.value.headerName,
        value: headersFormData.value.headerValue
      })
    }

    const options: Options = {
      url: urlFormData.value.url,
      method: urlFormData.value.method,
      headers,
    }

    return options
}

const submitFetch = async () => {
  generatedCurl.value = undefined

  try {
    const options = getFormData()

    const response = await callFetch(options)
    responseToDisplay.value = response
  } catch (error: any) {
    responseToDisplay.value = error.message
  }
}

const submitCurl = () => {
  responseToDisplay.value = undefined

  try {
    const options = getFormData()

    generatedCurl.value = generateCurl(options, true)

  } catch (error: any) {
    generatedCurl.value = error.message
  }
}

</script>


<template>
  <body>
    <h1>Fetch It</h1>
    <div class="flex flex-row h-8 gap-2">
      <Send @click="submitFetch" />
      <GeneratecURL @click="submitCurl" />
    </div>
    <div class="flex flex-col gap-5 w-full px-7">
        <UrlForm v-model="urlFormData" />
        <HeadersForm v-model="headersFormData" />
    </div>
    <span class="w-4/5 h-0.5 bg-stone-900"></span>
    <DisplayCurl :curl="generatedCurl" />
    <DisplayResponse :response="responseToDisplay" />
  </body>
</template>

<style>
@import "tailwindcss";

@layer base {
  body {
    @apply bg-stone-800 text-gray-50 flex flex-col gap-5 items-center w-screen overflow-hidden max-h-screen pt-7
  }

  h1 {
    @apply text-7xl font-extrabold
  }

  button {
    @apply cursor-pointer bg-gray-300 hover:bg-gray-400 text-stone-800 font-bold py-2 px-4 rounded inline-flex items-center
  }
}
</style>
