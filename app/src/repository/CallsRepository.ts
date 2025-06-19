import type { fetchCall, fetchCollection } from "../interfaces/interfaces"

export default class CallsRepository {
  saveCall(call: fetchCall): void {
    try {
      const _previousCalls: string | null = localStorage.getItem('fetch-calls')
      const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []
      previousCalls.push(call)
      localStorage.setItem('fetch-calls', JSON.stringify(previousCalls))
    } catch (error) {
      throw new Error('Error saving call')
    }
  }

  saveMultipleCalls(calls: fetchCall[]): void {
    try {
      const _previousCalls: string | null = localStorage.getItem('fetch-calls')
      const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []
      localStorage.setItem('fetch-calls', JSON.stringify(previousCalls.concat(calls)))
    } catch (error) {
      throw new Error('Error saving call')
    }
  }

  getAllCalls(): { name: string, fetchId: string }[] {
    try {
      const _previousCalls: string | null = localStorage.getItem('fetch-calls')
      const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []
      return previousCalls.map(call => { return { name: call.name, fetchId: call.fetchId } })
    } catch (error) {
      throw new Error('Error loading previous calls')
    }
  }

  getCollectionlessCalls(): { name: string, fetchId: string }[] {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const callsInCollections: string[] = [...new Set(collections.flatMap(collection => collection.calls))]

      const _previousCalls: string | null = localStorage.getItem('fetch-calls')
      const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []

      const filteredCalls = previousCalls.filter(call => !callsInCollections.includes(call.fetchId))
      return filteredCalls.map(call => { return { name: call.name, fetchId: call.fetchId } })

    } catch (error) {
      throw new Error('Error loading previous calls')
    }
  }

  getCallsByCollection(collectionId: string): { name: string, fetchId: string }[] {
    try {
      const _collections: string | null = localStorage.getItem('fetch-collections')
      const collections: fetchCollection[] = _collections ? JSON.parse(_collections) : []

      const collectionIndex: number = collections.findIndex(collection => collection.fetchId === collectionId)

      if (collectionIndex !== -1) {
        const _previousCalls: string | null = localStorage.getItem('fetch-calls')
        const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []
        const filteredCalls = previousCalls.filter(call => collections[collectionIndex].calls.includes(call.fetchId))
        return filteredCalls.map(call => { return { name: call.name, fetchId: call.fetchId } })

      } else throw new Error('Collection not found')
    } catch (error) {
      throw new Error(`Error loading collections: ${error}`)
    }
  }

  getAllCallsToDownload(): Blob {
    try {
      const previousCalls = localStorage.getItem('fetch-calls') ?? ''
      const blob = new Blob([previousCalls], { type: "application/json" })
      return blob
    } catch (error) {
      throw new Error('Error setting previous calls to download')
    }
  }

  loadCallById(callId: string): fetchCall | undefined {
    try {
      const _previousCalls: string | null = localStorage.getItem('fetch-calls')
      const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []

      const foundCall: fetchCall | undefined = previousCalls.find(call => call.fetchId === callId)
      return foundCall;
    } catch (error) {
      throw new Error(`Error loading call ${callId}`);
    }
  }

  deleteCallById(callId: string): void {
    try {
      const _previousCalls: string | null = localStorage.getItem('fetch-calls')
      const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []

      const callIndex: number = previousCalls.findIndex(call => call.fetchId === callId)

      if (callIndex !== -1) {
        previousCalls.splice(callIndex, 1)
        localStorage.setItem('fetch-calls', JSON.stringify(previousCalls))
      }
    } catch (error) {
      throw new Error(`Error deleting call ${callId}`)
    }
  }

  updateCallNameById(callId: string, newName: string): void {
    try {
      const _calls: string | null = localStorage.getItem('fetch-calls')
      const calls: fetchCall[] = _calls ? JSON.parse(_calls) : []

      const callIndex: number = calls.findIndex(call => call.fetchId === callId)

      if (callIndex !== -1) {
        calls[callIndex].name = newName

        localStorage.setItem('fetch-calls', JSON.stringify(calls))
      } else throw new Error('Call not found')
    } catch (error) {
      throw new Error(`Error updating name on call ${callId}`)
    }
  }
}