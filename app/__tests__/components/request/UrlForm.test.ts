declare let expect: any
import { describe, it } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import UrlForm from '../../../src/components/request/UrlForm.vue'

describe('UrlForm', () => {
  it('renders input field and method selector', () => {
    render(UrlForm, {
      props: {
        modelValue: { method: 'GET', url: '' }
      }
    })

    expect(screen.getByRole('textbox', { name: /request url/i })).toBeInTheDocument()
  })

  it('validates URL correctly and displays error if invalid', async () => {
    render(UrlForm, {
      props: {
        modelValue: { method: 'POST', url: '' }
      }
    })

    const input = screen.getByRole('textbox', { name: /request url/i })
    await fireEvent.update(input, 'not-a-url')

    expect(await screen.findByText(/please enter a valid url/i)).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not show error if input is empty', async () => {
    render(UrlForm, {
      props: {
        modelValue: { method: 'POST', url: '' }
      }
    })

    const input = screen.getByRole('textbox', { name: /request url/i })
    await fireEvent.update(input, '')

    expect(screen.queryByText(/please enter a valid url/i)).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('displays no error when valid URL is entered', async () => {
    render(UrlForm, {
      props: {
        modelValue: { method: 'GET', url: '' }
      }
    })

    const input = screen.getByRole('textbox', { name: /request url/i })
    await fireEvent.update(input, 'https://example.com')

    expect(screen.queryByText(/please enter a valid url/i)).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })
})
