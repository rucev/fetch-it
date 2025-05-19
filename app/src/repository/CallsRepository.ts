import type { fetchCall } from "../interfaces/interfaces";

export default class CallsRepository {
    saveCall(call: fetchCall): void {
        try {
            const _previousCalls: string | null = localStorage.getItem('fetch-calls')
            const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []
            previousCalls.push(call)
            localStorage.setItem('fetch-calls', JSON.stringify(previousCalls));
        } catch (error) {
            throw new Error('Error saving call');
        }
    }

    loadCalls(): fetchCall[] {
        try {
            const _previousCalls: string | null = localStorage.getItem('fetch-calls')
            const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []
            return previousCalls;
        } catch (error) {
            throw new Error('Error loading previous calls');
        }
    }

    loadCallById(id: string): fetchCall | undefined {
        try {
            const _previousCalls: string | null = localStorage.getItem('fetch-calls')
            const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []

            const foundCall: fetchCall | undefined = previousCalls.find(call => call.fetchId === id)
            return foundCall;
        } catch (error) {
            throw new Error(`Error loading call ${id}`);
        }
    }

    deleteCallById(id: string): void {
        try {
            const _previousCalls: string | null = localStorage.getItem('fetch-calls')
            const previousCalls: fetchCall[] = _previousCalls ? JSON.parse(_previousCalls) : []

            const callIndex: number = previousCalls.findIndex(call => call.fetchId === id)

            if (callIndex !== -1) {
                previousCalls.splice(callIndex, 1)
                localStorage.setItem('fetch-calls', JSON.stringify(previousCalls));
            }
        } catch (error) {
            throw new Error(`Error deleting call ${id}`);
        }
    }
}