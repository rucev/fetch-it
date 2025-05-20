<script setup lang="ts">
import { computed, nextTick, ref, toRaw, watch } from 'vue'
//Components
import UrlForm from './components/UrlForm.vue'
import HeadersForm from './components/HeadersForm.vue'
import DisplayResponse from './components/DisplayResponse.vue'
import BodyForm from './components/BodyForm.vue'
import Footer from './components/Footer.vue'
import LateralBar from './components/LateralBar.vue'
import DisplayCurl from './components/DisplayCurl.vue'
//Buttons
import Send from './components/buttons/Send.vue'
import GeneratecURL from './components/buttons/GeneratecURL.vue'
import Save from './components/buttons/Save.vue'
import Reset from './components/buttons/Reset.vue'
//Validators, Core Functions and Repository
import { callFetch } from './core/fetchIt.ts'
import { generateCurl } from './core/generateCurl.ts'
import { doesMethodAcceptBody } from './validators/options.ts'
import CallsRepository from './repository/CallsRepository.ts'
import CallMapper from './repository/CallMapper.ts'
//Types & Interfaces
import type { BodyInfo, fetchCall, Header, Options, ResponseToDisplay } from './interfaces/interfaces.ts'



const urlFormData = ref<Record<string, any>>({method: 'GET'})
let headersFormData = ref<Header[]>([])
let responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
const generatedCurl = ref<string[] | string | undefined>(undefined)
const isFormDisplayed = ref<boolean>(false)
const displayResponse = ref<boolean>(false)
const displayCurl = ref<boolean>(false)
let bodyFormData = ref<BodyInfo | undefined>(undefined)

const lastRequestSnapshot = ref<string>('')

const callRepo = new CallsRepository()

const canSave = computed(() => {
  const hasUrl = !!urlFormData.value.url
  const hasHeaders = headersFormData.value.length > 0
  const hasBody = !!bodyFormData.value?.content
  const hasResponse = !!responseToDisplay

  return hasUrl && (hasHeaders || hasBody || hasResponse)
})

watch(canSave, (newVal) => {
  console.log('canSave changed:', newVal)
})

watch(
  [urlFormData, headersFormData, bodyFormData, canSave],
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
  console.log(`click`)
  displayCurl.value = true
  try {
    const options = getFormData()
    generatedCurl.value = generateCurl(options, true)
    lastRequestSnapshot.value = JSON.stringify(options)
  } catch (error: any) {
    generatedCurl.value = error.message
  }
}

const loadCallById = (id: string) => {
  const call = callRepo.loadCallById(id)
  if (call) {
    const [options, response] = CallMapper.toDomain(call)
    urlFormData.value = { method: options.method, url: options.url }
    headersFormData.value = options.headers || []
    bodyFormData.value = options.body || undefined

    displayResponse.value = false
    nextTick(() => {
      responseToDisplay.value = response
      displayResponse.value = true
    })
  }
}

const resetCall = () => {
  urlFormData.value = {method: 'GET'}
  headersFormData.value = []
  responseToDisplay.value = undefined
  generatedCurl.value = undefined
  displayResponse.value = false
  displayCurl.value = false
  bodyFormData.value = undefined
}

const saveCall = () => {
  const options: Options = getFormData()
  const res: ResponseToDisplay | undefined = responseToDisplay.value ?  toRaw(responseToDisplay.value) : undefined
  const call: fetchCall = CallMapper.toPersistence(options, res)
  callRepo.saveCall(call)
}

</script>
<template>
  <main>
    <LateralBar v-on:load-call="loadCallById"/>
    <div class="flex flex-col gap-5 pt-5 overflow-y-hidden items-center w-full overflow-hidden h-full">
      <h1>Fetch It</h1>
      <div class="flex flex-row min-h-8 h-fit justify-center gap-2 flex-wrap">
        <Send :disabled="!canSave" :onClick="submitFetch" />
        <GeneratecURL :disabled="!canSave" :onClick="submitCurl" />
        <Save :disabled="!canSave" :onClick="saveCall" />
        <Reset :disabled="!canSave" :onClick="resetCall" />
      </div>
      <div class="flex flex-col justify-center items-center gap-5 w-full">
        <div class="w-full max-w-[720px] flex gap-4 flex-row">
          <button class="config-btn" @click="isFormDisplayed = !isFormDisplayed" >
            <i :class="['pi', isFormDisplayed ? 'pi-times': 'pi-cog']"></i>
          </button>
          <UrlForm v-model="urlFormData" />
        </div>
          <div v-show="isFormDisplayed" class="flex flex-col gap-2 w-full">
            <HeadersForm v-model="headersFormData" />
            <BodyForm v-if="methodAcceptsBody" :body="bodyFormData" v-model="bodyFormData" />
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