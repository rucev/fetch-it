<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import UrlForm from './components/UrlForm.vue'
import HeadersForm from './components/HeadersForm.vue'
import DisplayResponse from './components/DisplayResponse.vue'
import BodyForm from './components/BodyForm.vue'
import { callFetch } from './core/fetchIt.ts'
import type { BodyInfo, Header, Options, ResponseToDisplay } from './interfaces/interfaces.ts'
import Send from './components/buttons/Send.vue'
import GeneratecURL from './components/buttons/GeneratecURL.vue'
import { generateCurl } from './core/generateCurl.ts'
import DisplayCurl from './components/DisplayCurl.vue'
import { doesMethodAcceptBody } from './validators/options.ts'

const urlFormData = ref<Record<string, any>>({method: 'GET'})
const headersFormData = ref<Header[]>([])
const responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
const generatedCurl = ref<string[] | string | undefined>(undefined)
const isFormDisplayed = ref<boolean>(false)
const display = ref<string |undefined>(undefined)
const bodyFormData = ref<BodyInfo | undefined>(undefined)

const lastRequestSnapshot = ref<string>('')

watch(
  [urlFormData, headersFormData, bodyFormData],
  () => {
    const currentSnapshot = JSON.stringify(getFormData())
    if (currentSnapshot !== lastRequestSnapshot.value) {
      responseToDisplay.value = undefined
      generatedCurl.value = undefined
    }
  },
  { deep: true }
)

const methodAcceptsBody = computed(() => 
  doesMethodAcceptBody(urlFormData.value.method)
)

const getFormData = (): Options => {
  const headers: Header[] = headersFormData.value
    .filter(header => header.name && header.value)
    .map(header => ({ name: header.name, value: header.value }))

    const options: Options = {
      url: urlFormData.value.url,
      method: urlFormData.value.method,
      headers,
      body: toRaw(bodyFormData.value)
    }

    return options
}

const submitFetch = async () => {
  display.value = 'response'
  try {
    const options = getFormData()
    const response = await callFetch(options)
    responseToDisplay.value = response
    lastRequestSnapshot.value = JSON.stringify(options)
  } catch (error: any) {
    responseToDisplay.value = error.message
  }
}

const submitCurl = () => {
  display.value = 'curl'
  try {
    const options = getFormData()
    generatedCurl.value = generateCurl(options, true)
    lastRequestSnapshot.value = JSON.stringify(options)
  } catch (error: any) {
    generatedCurl.value = error.message
  }
}

const toggleDisplayResponse = () => {
  if(display.value === 'response') display.value = undefined
  else display.value = 'response'
}

</script>

<template>
  <main>
    <h1>Fetch It</h1>
    <div class="flex flex-row h-8 gap-2">
      <Send @click="submitFetch" />
      <GeneratecURL @click="submitCurl" />
    </div>
    <div class="flex flex-col gap-5 w-full">
      <div class="w-full flex gap-4 flex-row">
        <button class="configBtn" @click="isFormDisplayed = !isFormDisplayed" >
          <i :class="['pi', isFormDisplayed ? 'pi-times': 'pi-cog']"></i>
        </button>
        <UrlForm v-model="urlFormData" />
      </div>
        <div v-show="isFormDisplayed" class="flex flex-col gap-2">
          <HeadersForm v-model="headersFormData" />
          <BodyForm v-if="methodAcceptsBody" v-model="bodyFormData" />
        </div>
    </div>
    <span class="w-4/5 h-0.5 bg-stone-900"></span>
    <div>
    </div>
    <button v-if="responseToDisplay" class="responseBtn" @click="toggleDisplayResponse">
      <i :class="['pi', display === 'response' ? 'pi-eye-slash': 'pi-eye']"></i>
      {{ display === 'response' ? 'Hide response' : 'Show Response' }}
    </button>
    <DisplayCurl v-if="display === 'curl'" :curl="generatedCurl" />
    <DisplayResponse v-if="display === 'response'" :response="responseToDisplay" />
  </main>
</template>

<style>
@import "tailwindcss";

@layer base {
  main {
    @apply bg-stone-800 text-gray-50 flex flex-col gap-5 overflow-y-hidden items-center max-w-screen overflow-hidden min-h-screen pt-7 px-7
  }

  h1 {
    @apply text-7xl font-extrabold
  }
}

@layer components {
  .configBtn {
    @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex items-center
  }
  .responseBtn {
    @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex flex-row items-center self-start gap-2
  }
}
</style>
