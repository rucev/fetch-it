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
import Footer from './components/Footer.vue'
import { generateCurl } from './core/generateCurl.ts'
import DisplayCurl from './components/DisplayCurl.vue'
import { doesMethodAcceptBody } from './validators/options.ts'

const urlFormData = ref<Record<string, any>>({method: 'GET'})
const headersFormData = ref<Header[]>([])
const responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
const generatedCurl = ref<string[] | string | undefined>(undefined)
const isFormDisplayed = ref<boolean>(false)
const displayResponse = ref<boolean>(false)
const displayCurl = ref<boolean>(false)
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
  displayResponse.value = true
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
  displayCurl.value = true
  try {
    const options = getFormData()
    generatedCurl.value = generateCurl(options, true)
    lastRequestSnapshot.value = JSON.stringify(options)
  } catch (error: any) {
    generatedCurl.value = error.message
  }
}

</script>

<template>
  <main>
    <div class="flex flex-col gap-5 overflow-y-hidden items-center w-full overflow-hidden h-full">
      <h1>Fetch It</h1>
      <div class="flex flex-row h-8 gap-2">
        <Send @click="submitFetch" />
        <GeneratecURL @click="submitCurl" />
      </div>
      <div class="flex flex-col justify-center items-center gap-5 w-full">
        <div class="w-full max-w-[720px] flex gap-4 flex-row">
          <button class="config-btn" @click="isFormDisplayed = !isFormDisplayed" >
            <i :class="['pi', isFormDisplayed ? 'pi-times': 'pi-cog']"></i>
          </button>
          <UrlForm v-model="urlFormData" />
        </div>
          <div v-show="isFormDisplayed" class="flex flex-col gap-2 w-full md:px-7">
            <HeadersForm v-model="headersFormData" />
            <BodyForm v-if="methodAcceptsBody" v-model="bodyFormData" />
          </div>
      </div>
      <span class="w-4/5 h-0.5 bg-stone-900"></span>
      <div>
      </div>
      <button v-if="responseToDisplay" class="response-btn" @click="() => {displayResponse = !displayResponse}">
        <i :class="['pi', displayResponse ? 'pi-eye-slash': 'pi-eye']"></i>
        {{ displayResponse ? 'Hide response' : 'Show Response' }}
      </button>
      <DisplayResponse v-if="displayResponse" :response="responseToDisplay" />
      <DisplayCurl v-if="displayCurl" :curl="generatedCurl" :onCloseCurl="() => {displayCurl = false}" />
    </div>
    <Footer></Footer>
  </main>
</template>

<style>
@import "tailwindcss";

@layer base {
  main {
    @apply bg-stone-800 text-gray-50 flex flex-col gap-5 overflow-y-hidden justify-between items-center max-w-screen overflow-hidden min-h-screen pt-7 px-7
  }

  h1 {
    @apply text-7xl font-extrabold
  }
}

@layer components {
  .config-btn {
    @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex items-center
  }
  .response-btn {
    @apply cursor-pointer border-stone-600 border-1 hover:text-gray-200 hover:border-gray-200 text-stone-400 font-bold py-2 px-4 rounded inline-flex flex-row items-center self-start gap-2
  }
}
</style>