declare let expect: any
import { describe, it } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import MethodSelector from '../../../../src/components/request/dropdownInputs/MethodSelector.vue'

describe('MethodSelector', () => {
  it('renders all method options', () => {
    render(MethodSelector, {
      props: {
        modelValue: 'GET',
      },
    })

    const select = screen.getByRole('combobox', {
      name: /select http method/i,
    })

    expect(select).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    const optionValues = options.map((opt) => (opt as HTMLOptionElement).value)

    expect(optionValues).toEqual([
      '',
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'HEAD',
      'OPTIONS',
    ])
  })

  it('initially selects the correct value', () => {
    render(MethodSelector, {
      props: {
        modelValue: 'POST',
      },
    })

    const select = screen.getByRole('combobox')
    expect((select as HTMLSelectElement).value).toBe('POST')
  })

  it('emits update:modelValue when a new method is selected', async () => {
    const { emitted } = render(MethodSelector, {
      props: {
        modelValue: 'GET',
      },
    })

    const select = screen.getByRole('combobox')
    await fireEvent.update(select, 'PUT')

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue']?.[0]).toEqual(['PUT'])
  })
})