declare let expect: any
import { render, fireEvent } from '@testing-library/vue'
import { describe, it, vi } from 'vitest'
import OptionsMenu from '../../../src/components/options/OptionsMenu.vue'

describe('OptionsMenu', () => {
  it('renders all Option buttons with correct labels and icons', () => {
    const { getByRole } = render(OptionsMenu, {
      props: {
        canSave: true,
        submitFetch: vi.fn(),
        submitCurl: vi.fn(),
        saveCall: vi.fn(),
        resetCall: vi.fn()
      }
    })

    expect(getByRole('button', { name: 'Send API' })).toBeTruthy()
    expect(getByRole('button', { name: 'Generate a cURL' })).toBeTruthy()
    expect(getByRole('button', { name: 'Save call data' })).toBeTruthy()
    expect(getByRole('button', { name: 'Reset all inputs' })).toBeTruthy()
  })

  it('calls the correct handler when a button is clicked', async () => {
    const submitFetch = vi.fn()
    const submitCurl = vi.fn()
    const saveCall = vi.fn()
    const resetCall = vi.fn()

    const { getByRole } = render(OptionsMenu, {
      props: {
        canSave: true,
        submitFetch,
        submitCurl,
        saveCall,
        resetCall
      }
    })

    await fireEvent.click(getByRole('button', { name: 'Send API' }))
    expect(submitFetch).toHaveBeenCalledTimes(1)

    await fireEvent.click(getByRole('button', { name: 'Generate a cURL' }))
    expect(submitCurl).toHaveBeenCalledTimes(1)

    await fireEvent.click(getByRole('button', { name: 'Save call data' }))
    expect(saveCall).toHaveBeenCalledTimes(1)

    await fireEvent.click(getByRole('button', { name: 'Reset all inputs' }))
    expect(resetCall).toHaveBeenCalledTimes(1)
  })

  it('disables all buttons when canSave is false', () => {
    const { getByRole } = render(OptionsMenu, {
      props: {
        canSave: false,
        submitFetch: vi.fn(),
        submitCurl: vi.fn(),
        saveCall: vi.fn(),
        resetCall: vi.fn()
      }
    })

    const send = getByRole('button', { name: 'Send API' })
    const curl = getByRole('button', { name: 'Generate a cURL' })
    const save = getByRole('button', { name: 'Save call data' })
    const reset = getByRole('button', { name: 'Reset all inputs' })

    expect(send).toHaveAttribute('aria-disabled', 'true')
    expect(curl).toHaveAttribute('aria-disabled', 'true')
    expect(save).toHaveAttribute('aria-disabled', 'true')
    expect(reset).toHaveAttribute('aria-disabled', 'true')
  })
})
