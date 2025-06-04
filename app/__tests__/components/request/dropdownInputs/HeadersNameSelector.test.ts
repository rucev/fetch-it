declare let expect: any
import { describe, it, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import HeadersNameSelector from '../../../../src/components/request/dropdownInputs/HeadersNameSelector.vue'
import { HeaderRequest } from '../../../../src/interfaces/interfaces'

vi.mock('../../../../src/constants/headerNames', () => ({
  HEADER_NAMES: ['Content-Type', 'Authorization', 'Accept'],
}))

describe('HeadersNameSelector', () => {
  it('renders select when isCustom is false', async () => {
    render(HeadersNameSelector, {
      props: { modelValue: { isCustom: false, content: 'Authorization' } },
    })

    const select = await screen.findByRole('combobox', { name: /predefined http header name/i })
    expect(select).toBeInTheDocument()
    expect((select as HTMLSelectElement).value).toBe('Authorization')

    expect(screen.queryByRole('textbox', { name: /custom http header name/i })).toBeNull()
  })

  it('renders input when isCustom is true', async () => {
    render(HeadersNameSelector, {
      props: { modelValue: { isCustom: true, content: 'X-Custom-Header' } },
    })

    const input = await screen.findByRole('textbox', { name: /custom http header name/i })
    expect(input).toBeInTheDocument()
    expect((input as HTMLInputElement).value).toBe('X-Custom-Header')

    expect(screen.queryByRole('combobox', { name: /predefined http header name/i })).toBeNull()
  })

  it('emits update:modelValue when user changes select', async () => {
    const { emitted } = render(HeadersNameSelector, {
      props: { modelValue: { isCustom: false, content: 'Authorization' } },
    })

    const select = await screen.findByRole('combobox', { name: /predefined http header name/i })
    await fireEvent.update(select, 'Accept')

    expect(emitted()['update:modelValue']).toBeTruthy()
  })

  it('emits update:modelValue when user changes input', async () => {
    const { emitted } = render(HeadersNameSelector, {
      props: { modelValue: { isCustom: true, content: 'X-Custom-Header' } },
    })

    const input = await screen.findByRole('textbox', { name: /custom http header name/i })
    await fireEvent.update(input, 'X-New-Header')

    expect(emitted()['update:modelValue']).toBeTruthy()
  })

  it('toggles between select and input on button click', async () => {
    const { emitted } = render(HeadersNameSelector, {
      props: { modelValue: { isCustom: false, content: 'Content-Type' } },
    })

    expect(screen.queryByRole('combobox')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeNull()

    const toggleButton = await screen.findByRole('button', { name: /switch to custom header input/i })
    await fireEvent.click(toggleButton)

    expect(screen.queryByRole('textbox')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()

    expect(emitted()['update:modelValue']).toBeTruthy()

    const lastEmitData = (emitted()['update:modelValue'] as [HeaderRequest]).at(-1)?.[0]
    const lastEmit = lastEmitData ? lastEmitData : {}
    expect(lastEmit.isCustom).toBe(true)

    const toggleBackButton = await screen.findByRole('button', { name: /switch to predefined header select/i })
    await fireEvent.click(toggleBackButton)

    expect(screen.queryByRole('combobox')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeNull()

    const lastEmitData2 = (emitted()['update:modelValue'] as [HeaderRequest]).at(-1)?.[0]
    const lastEmit2 = lastEmitData2 ? lastEmitData2 : {}
    expect(lastEmit2.isCustom).toBe(false)
  })
})
