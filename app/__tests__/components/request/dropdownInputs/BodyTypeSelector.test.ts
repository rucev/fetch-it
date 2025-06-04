declare let expect: any
import { describe, it } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import BodyTypeSelector from '../../../../src/components/request/dropdownInputs//BodyTypeSelector.vue'

describe('BodyTypeSelector', () => {
  it('renders with correct initial value', async () => {
    render(BodyTypeSelector, {
      props: {
        modelValue: 'json',
      },
    })

    const select = await screen.findByRole('combobox', { name: /select body content type/i })
    expect(select).toBeInTheDocument()
    expect((select as HTMLSelectElement).value).toBe('json')
  })

  it('shows all body type options', async () => {
    render(BodyTypeSelector, {
      props: {
        modelValue: 'text',
      },
    })

    const options = await screen.findAllByRole('option')
    const values = options.map((opt) => (opt as HTMLOptionElement).value)
    expect(values).toEqual(['json', 'text', 'xml'])
  })

  it('emits update:modelValue when selection changes', async () => {
    const { emitted } = render(BodyTypeSelector, {
      props: {
        modelValue: 'json',
      },
    })

    const select = await screen.findByRole('combobox', { name: /select body content type/i })
    await fireEvent.update(select, 'xml')

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['xml'])
  })
})
