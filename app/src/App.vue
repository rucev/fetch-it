<script setup lang="ts">
  import { computed, nextTick, ref, toRaw, watch } from 'vue'
  import {DisplayResponse, Footer, LateralBar, DisplayCurl, RequestForm, OptionsMenu} from './components/index.ts'
  import { callFetch, generateCurl } from './core/index.ts'
  import { calls, collection } from './repository/index.ts'
  import type { BodyInfo, fetchCall, HeaderRequest, Options, ResponseToDisplay } from './interfaces/interfaces.ts'
  import CollectionModal from './components/CollectionModal.vue'

  const urlFormData = ref<Record<string, any>>({method: 'GET'})
  let headersFormData = ref<HeaderRequest[]>([])
  let bodyFormData = ref<BodyInfo | undefined>(undefined)

  let responseToDisplay = ref<ResponseToDisplay | undefined>(undefined)
  const generatedCurl = ref<string[] | string | undefined>(undefined)
  const selectedCollection = ref<string>('')

  const isFormDisplayed = ref<boolean>(false)
  const displayResponse = ref<boolean>(false)
  const displayCurl = ref<boolean>(false)
  const displayCollectionModal = ref<boolean>(false)
  const hasChangedRequestSinceLoad = ref<boolean>(false)
  const hasChangedResponseSinceLoad = ref<boolean>(false)
  
  const notification = ref<{level: 'danger' | 'success', value: string} | undefined>(undefined)
  
  const responseSnapshot = ref<string>('')
  const lastRequestSnapshot = ref<string>('')

  const callRepo = new calls.repository()
  const collectionRepo = new collection.repository()

  const canCurl = computed(() => {
    return !!urlFormData.value.url
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

  const getResponse = () => {
    return responseToDisplay.value ? responseToDisplay.value : ''
  }

  watch(
    [urlFormData, headersFormData, bodyFormData],
    () => {
      const currentSnapshot = JSON.stringify(getFormData())
      hasChangedRequestSinceLoad.value = currentSnapshot !== lastRequestSnapshot.value
    },
    { deep: true }
  )

  watch(
    () => responseToDisplay.value,
    () => {
      const response = JSON.stringify(getResponse())
      hasChangedResponseSinceLoad.value = response !== responseSnapshot.value || hasChangedRequestSinceLoad.value
    },
    { deep: true }
  )

  const submitFetch = async () => {
    displayResponse.value = true
    try {
      const options = getFormData()
      const response = await callFetch(options)

    nextTick(() => {
      responseToDisplay.value = response
      console.log(JSON.stringify(response) !== responseSnapshot.value)
      hasChangedResponseSinceLoad.value = JSON.stringify(response) !== responseSnapshot.value
      responseSnapshot.value = JSON.stringify(response)
      lastRequestSnapshot.value = JSON.stringify(options)
      hasChangedRequestSinceLoad.value = false
    })
      
    } catch (error: any) {
      responseToDisplay.value = error.message
    }
  }

  const submitCurl = () => {
    displayCurl.value = true
    try {
      const options = getFormData()
      generatedCurl.value = generateCurl(options, true)
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

      selectedCollection.value = collectionRepo.getCollectionByIncludedCall(call.fetchId)

      nextTick(() => {
        lastRequestSnapshot.value = JSON.stringify(getFormData())
        hasChangedRequestSinceLoad.value = false

        responseToDisplay.value = response
        hasChangedResponseSinceLoad.value = false
        displayResponse.value = true

        responseSnapshot.value = JSON.stringify(response)
      })

      displayResponse.value = false
    }
  }

  const selectCollectionById = (id: string | undefined) => {
    if(id) selectedCollection.value = id
    displayCollectionModal.value = true
  }

  const resetCall = () => {
    urlFormData.value = { method: 'GET' }
    headersFormData.value = []
    responseToDisplay.value = undefined
    generatedCurl.value = undefined
    displayResponse.value = false
    displayCurl.value = false
    bodyFormData.value = undefined

    lastRequestSnapshot.value = JSON.stringify(getFormData())
    responseSnapshot.value = ''
    hasChangedRequestSinceLoad.value = false
    hasChangedResponseSinceLoad.value = false
  }

  const setNotification = (level: 'danger' | 'success', value: string): void => {
      notification.value = {level: level, value: value}
      setTimeout(() => {
        notification.value = undefined
      }, 3000);
  }

  const saveCall = () => {
    try {
      const options: Options = getFormData()
      const res: ResponseToDisplay | undefined = responseToDisplay.value ?  toRaw(responseToDisplay.value) : undefined
      const call: fetchCall = calls.mapper.toPersistence(options, res)
      callRepo.saveCall(call)
      if(selectedCollection.value) collectionRepo.addCallsToCollection(selectedCollection.value, call.fetchId)
      setNotification('success', `Call Saved${selectedCollection.value ? ` in collection ${collectionRepo.getCollectionNameById(selectedCollection.value)}` : ''}`)
    } catch (error) {
      setNotification('danger', `error: ${error}`)
    }
  }

</script>
<template>
  <DisplayCurl v-if="displayCurl" :curl="generatedCurl" :onCloseCurl="() => {displayCurl = false}" />
  <CollectionModal v-if="displayCollectionModal" :collectionId="selectedCollection" :onClose="() => {displayCollectionModal = false}" />
  <main :class="[displayCurl || displayCollectionModal ? 'h-screen overflow-hidden blur-[0.1rem]' : 'h-screen min-h-fit']">
    <LateralBar v-on:load-call="loadCallById" :setCollection="selectCollectionById"/>
    <div v-if="notification" :class="`absolute opacity-85 top-0 text-center z-50 w-full h-fit py-2 ${notification.level === 'success' ? 'bg-green-800' : 'bg-red-900'}`">{{ notification.value }}</div>
    <div class="top-0 text-2xl font-bold">Fetch It <span v-if="selectedCollection">> {{ collectionRepo.getCollectionNameById(selectedCollection) }}</span></div>
    <div class="flex flex-col w-full lg:w-3/5 gap-5 pt-2 overflow-y-hidden items-center overflow-hidden min-h-3/5">
      <OptionsMenu :canCurl="canCurl" :submitFetch="submitFetch" :saveCall="saveCall" :resetCall="resetCall" :submitCurl="submitCurl" />
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