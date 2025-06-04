declare let expect: any
import { describe, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import HeadersForm from '../../../src/components/request/HeadersForm.vue'
import { HeaderRequest } from '../../../src/interfaces/interfaces'

vi.mock('../../../src/components/request/dropdownInputs/HeadersNameSelector.vue', () => ({
  default: {
    name: 'HeadersNameSelector',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `<input data-testid="header-name" :value="modelValue.content" @input="$emit('update:modelValue', { content: $event.target.value, isCustom: true })" />`
  }
}))

vi.mock('../../../src/components/request/dropdownInputs/HeadersValueSelector.vue', () => ({
  default: {
    name: 'HeadersValueSelector',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `<input data-testid="header-value" :value="modelValue.content" @input="$emit('update:modelValue', { content: $event.target.value, isCustom: true })" />`
  }
}))

describe('HeadersForm.vue', () => {
  const initialHeaders = [
    {
      name: { content: 'Content-Type', isCustom: false },
      value: { content: 'application/json', isCustom: false },
    }
  ]

  it('renders initial header rows', () => {
    const { getAllByTestId } = render(HeadersForm, {
      props: { modelValue: initialHeaders }
    })

    expect(getAllByTestId('header-name')).toHaveLength(1)
    expect(getAllByTestId('header-value')).toHaveLength(1)
  })

  it('emits update:modelValue on header name input change', async () => {
    const { getByTestId, emitted } = render(HeadersForm, {
      props: { modelValue: initialHeaders }
    })

    await fireEvent.update(getByTestId('header-name'), 'Authorization')

    expect(emitted()['update:modelValue']).toBeTruthy()
    const updatedData = (emitted()['update:modelValue'] as [HeaderRequest[]][]).at(-1)?.[0]
    const updated = updatedData ? updatedData : {}

    expect(updated[0].name.content).toBe('Authorization')
  })

  it('emits update:modelValue on header value input change', async () => {
    const { getByTestId, emitted } = render(HeadersForm, {
      props: { modelValue: initialHeaders }
    })

    await fireEvent.update(getByTestId('header-value'), 'Bearer token')

    expect(emitted()['update:modelValue']).toBeTruthy()
    const updatedData = (emitted()['update:modelValue'] as [HeaderRequest[]][]).at(-1)?.[0]
    const updated = updatedData ? updatedData : {}
    expect(updated[0].value.content).toBe('Bearer token')
  })

  it('adds a new header when Add Header button is clicked', async () => {
    const { getByRole, emitted } = render(HeadersForm, {
      props: { modelValue: initialHeaders }
    })

    await fireEvent.click(getByRole('button', { name: /add/i }))

    expect(emitted()['update:modelValue']).toBeTruthy()
    const updatedData = (emitted()['update:modelValue'] as [HeaderRequest[]][]).at(-1)?.[0]
    const updated = updatedData ? updatedData : {}

    expect(updated).toHaveLength(2)
    expect(updated[1].name.content).toBe('')
    expect(updated[1].value.content).toBe('')
  })

  it('removes a header when the trash button is clicked', async () => {
    const { getAllByRole, emitted } = render(HeadersForm, {
      props: {
        modelValue: [
          ...initialHeaders,
          {
            name: { content: 'X-Test', isCustom: true },
            value: { content: 'value', isCustom: true },
          },
        ]
      }
    })

    const trashButtons = getAllByRole('button', { name: /remove header/i })
    expect(trashButtons).toHaveLength(2)

    await fireEvent.click(trashButtons[0])

    expect(emitted()['update:modelValue']).toBeTruthy()
    const updatedData = (emitted()['update:modelValue'] as [HeaderRequest[]][]).at(-1)?.[0]
    const updated = updatedData ? updatedData : {}

    expect(updated).toHaveLength(1)
    expect(updated[0].name.content).toBe('X-Test')
  })
})
