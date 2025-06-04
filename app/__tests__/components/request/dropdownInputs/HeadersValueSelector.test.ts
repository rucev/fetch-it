declare let expect: any
import { describe, it, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import HeadersValueSelector from '../../../../src/components/request/dropdownInputs/HeadersValueSelector.vue'

vi.mock('../../../../src/constants/headerValues', () => {
  const mockHeaderValues = {
    'Content-Type': ['application/json', 'text/html'],
    'X-Custom': [],
  }

  return {
    HEADER_VALUES: mockHeaderValues,
  }
})

describe('HeadersValueSelector', () => {
  it('renders a dropdown for known header with values', async () => {
    render(HeadersValueSelector, {
      props: {
        modelValue: { content: '', isCustom: false },
        headerName: { content: 'Content-Type', isCustom: false },
      },
    })

    const select = await screen.findByRole('combobox', { name: /predefined header value/i })
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('application/json')
  })

  it('switches to custom input on button click', async () => {
    render(HeadersValueSelector, {
      props: {
        modelValue: { content: '', isCustom: false },
        headerName: { content: 'Content-Type', isCustom: false },
      },
    })

    const toggleButton = await screen.findByRole('button', { name: /switch to custom/i })
    await fireEvent.click(toggleButton)

    const input = await screen.findByRole('textbox', { name: /custom header value/i })
    expect(input).toBeInTheDocument()
  })

  it('emits updated modelValue on select change', async () => {
    const { emitted } = render(HeadersValueSelector, {
      props: {
        modelValue: { content: '', isCustom: false },
        headerName: { content: 'Content-Type', isCustom: false },
      },
    })

    const select = await screen.findByRole('combobox')
    await fireEvent.update(select, 'text/html')

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'].at(-1)).toEqual([
      { content: 'text/html', isCustom: false },
    ])
  })

  it('renders input for unknown header or empty default', async () => {
    render(HeadersValueSelector, {
      props: {
        modelValue: { content: 'custom', isCustom: true },
        headerName: { content: 'X-Custom', isCustom: true },
      },
    })

    const input = await screen.findByRole('textbox')
    expect(input).toHaveValue('custom')
  })
})
