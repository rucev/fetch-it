declare let expect: any
import { describe, it, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import RequestForm from '../../../src/components/request/RequestForm.vue'

vi.mock('../../../src/components/request/UrlForm.vue', () => ({
  default: {
    name: 'UrlForm',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<div>URL Form <button @click="$emit(\'update:modelValue\', { method: \'POST\', url: \'http://test.com\' })">Emit URL</button></div>'
  }
}))

vi.mock('../../../src/components/request/HeadersForm.vue', () => ({
  default: {
    name: 'HeadersForm',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<div>Headers Form <button @click="$emit(\'update:modelValue\', [{ key: \'Content-Type\', value: \'application/json\' }])">Emit Header</button></div>'
  }
}))

vi.mock('../../../src/components/request/BodyForm.vue', () => ({
  default: {
    name: 'BodyForm',
    props: ['body', 'modelValue'],
    emits: ['update:modelValue'],
    template: '<div>Body Form <button @click="$emit(\'update:modelValue\', { data: \'test\' })">Emit Body</button></div>'
  }
}))

vi.mock('../../../src/validators/options.ts', () => ({
  doesMethodAcceptBody: (method: string) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
}))

describe('RequestForm.vue', () => {
  const defaultProps = {
    urlFormData: { method: 'GET', url: '' },
    headersFormData: [],
    bodyFormData: {},
    isFormDisplayed: false,
  }

  it('renders toggle button and UrlForm always', () => {
    render(RequestForm, { props: defaultProps })

    const toggleBtn = screen.getByRole('button', { name: /toggle options form/i })

    expect(toggleBtn).toBeInTheDocument()
    expect(screen.getByText('URL Form')).toBeInTheDocument()
  })

  it('toggles isFormDisplayed on button click and emits update', async () => {
    const { emitted } = render(RequestForm, { props: defaultProps })
    const toggleBtn = screen.getByRole('button', { name: /toggle options form/i })

    await fireEvent.click(toggleBtn)

    expect(emitted()['update:isFormDisplayed']).toBeTruthy()
    expect(emitted()['update:isFormDisplayed'][0]).toEqual([true])
  })

  it('shows HeadersForm and BodyForm only when isFormDisplayed is true and method allows body', () => {
    render(RequestForm, {
      props: {
        ...defaultProps,
        isFormDisplayed: true,
        urlFormData: { method: 'POST', url: '' }
      }
    })

    expect(screen.getByText('Headers Form')).toBeInTheDocument()
    expect(screen.getByText('Body Form')).toBeInTheDocument()
  })

  it('shows HeadersForm but NOT BodyForm if method does not allow body', () => {
    render(RequestForm, {
      props: {
        ...defaultProps,
        isFormDisplayed: true,
        urlFormData: { method: 'GET', url: '' }
      }
    })

    expect(screen.getByText('Headers Form')).toBeInTheDocument()
    expect(screen.queryByText('Body Form')).not.toBeInTheDocument()
  })
})
