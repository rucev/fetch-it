<script setup lang="ts">
  import { computed, nextTick, ref, toRaw, watchEffect } from 'vue'
  import {DisplayResponse, Footer, LateralBar, DisplayCurl, RequestForm, OptionsMenu} from './components/index.ts'
  import { callFetch, generateCurl } from './core/index.ts'
  import { calls } from './repository/index.ts'
  import type { BodyInfo, fetchCall, HeaderRequest, Options, ResponseToDisplay } from './interfaces/interfaces.ts'

  const urlFormData = ref<Record<string, any>>({method: 'GET'})
  let headersFormData = ref<HeaderRequest[]>([])
  let responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
  const generatedCurl = ref<string[] | string | undefined>(undefined)
  const isFormDisplayed = ref<boolean>(false)
  const displayResponse = ref<boolean>(false)
  const displayCurl = ref<boolean>(false)
  const hasChangedSinceLoad = ref(false)
  let bodyFormData = ref<BodyInfo | undefined>(undefined)

  const lastRequestSnapshot = ref<string>('')

  const callRepo = new calls.repository()

  
  const canCurl = computed(() => {
    const hasUrl = !!urlFormData.value.url

    return hasUrl
  })

  const canSave = computed(() => {
    const hasUrl = !!urlFormData.value.url

    return hasChangedSinceLoad.value && hasUrl
  })

    const getFormData = (): Options => {
    const headers: HeaderRequest[] = headersFormData.value
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

  watchEffect(() => {
    const currentSnapshot = JSON.stringify(getFormData())

    hasChangedSinceLoad.value = currentSnapshot !== lastRequestSnapshot.value

    if (hasChangedSinceLoad.value) {
      responseToDisplay.value = undefined
      generatedCurl.value = undefined
    }
  })

  const submitFetch = async () => {
    displayResponse.value = true
    try {
      const options = getFormData()
      const response = await callFetch(options)
      responseToDisplay.value = response
      lastRequestSnapshot.value = JSON.stringify(options)
      hasChangedSinceLoad.value = false 
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
      hasChangedSinceLoad.value = false 
    } catch (error: any) {
      generatedCurl.value = error.message
    }
  }

  const loadCallById = (id: string) => {
    const call = callRepo.loadCallById(id)
    if (call) {
      const [options, response] = calls.mapper.toDomain(call)
      urlFormData.value = { method: options.method, url: options.url }
      headersFormData.value = options.headers || []
      bodyFormData.value = options.body || undefined

      nextTick(() => {
        lastRequestSnapshot.value = JSON.stringify(getFormData())
        hasChangedSinceLoad.value = false

        responseToDisplay.value = response
        displayResponse.value = true
      })

      displayResponse.value = false
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
    const call: fetchCall = calls.mapper.toPersistence(options, res)
    callRepo.saveCall(call)
  }

</script>
<template>
  <DisplayCurl v-if="displayCurl" :curl="generatedCurl" :onCloseCurl="() => {displayCurl = false}" />
  <main :class="[displayCurl ? 'h-screen overflow-hidden blur-[0.1rem]' : 'h-fit']">
    <LateralBar v-on:load-call="loadCallById"/>
    <div class="flex flex-col gap-5 pt-5 overflow-y-hidden items-center w-full overflow-hidden h-full">
      <h1 class="text-7xl font-extrabold">Fetch It</h1>
      <OptionsMenu :canSave="canSave" :canCurl="canCurl" :submitFetch="submitFetch" :saveCall="saveCall" :resetCall="resetCall" :submitCurl="submitCurl" />
      <RequestForm v-model:urlFormData="urlFormData" v-model:headersFormData="headersFormData" v-model:bodyFormData="bodyFormData" v-model:isFormDisplayed="isFormDisplayed" />
      <hr class="w-4/5 border-0 h-0.5 bg-stone-900" />
      <DisplayResponse v-if="responseToDisplay" :response="responseToDisplay" />      
    </div>
    <Footer></Footer>
  </main>
</template>
<style>
  @import "tailwindcss";

  @layer base {
    body {
      @apply bg-stone-800 text-gray-50
    }

    main {
      @apply flex flex-col gap-5 overflow-y-hidden justify-between items-center max-w-screen overflow-hidden min-h-screen pt-7 px-7
    }

    button, input {
      @apply cursor-pointer
    }
  }
</style>