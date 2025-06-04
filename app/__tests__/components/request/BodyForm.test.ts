declare let expect: any
import { describe, it } from 'vitest'
import { render, fireEvent, screen, waitFor } from '@testing-library/vue'
import BodyForm from '../../../src/components/request/BodyForm.vue'

describe('BodyForm', () => {
  it('renders "Add Body" button initially', () => {
    render(BodyForm, {
      props: {
        body: undefined
      }
    })
    expect(screen.getByRole('button', { name: /add request body/i })).toBeInTheDocument()
  })

  it('reveals textarea when "Add Body" is clicked', async () => {
    render(BodyForm, { props: { body: undefined } })

    const addButton = screen.getByRole('button', { name: /add request body/i })
    await fireEvent.click(addButton)

    expect(screen.getByRole('textbox')).toBeVisible()
  })

  it('emits valid JSON as an object when typed and valid', async () => {
    const { emitted } = render(BodyForm, {
      props: { body: undefined }
    })

    await fireEvent.click(screen.getByRole('button', { name: /add request body/i }))
    const textarea = screen.getByRole('textbox')

    await fireEvent.update(textarea, '{ "foo": "bar" }')

    await waitFor(() => {
      const updateEvents = emitted()['update:modelValue']
      expect(updateEvents).toBeTruthy()
      expect(updateEvents?.at(-1)).toEqual([
        { content: { foo: 'bar' }, type: 'json' }
      ])
    })
  })

  it('shows error and does not emit on invalid JSON', async () => {
    const { emitted } = render(BodyForm, {
      props: { body: undefined }
    })

    await fireEvent.click(screen.getByRole('button', { name: /add request body/i }))
    const textarea = screen.getByRole('textbox')

    await fireEvent.update(textarea, '{ foo: bar }')

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/invalid/i)).toBeVisible()

      const emits = emitted()['update:modelValue']
      expect(emits).toBeUndefined()
    })
  })

  it('removes the body input when "Remove Body" is clicked', async () => {
    render(BodyForm, {
      props: {
        body: {
          type: 'json',
          content: { test: 123 }
        }
      }
    })

    const removeBtn = await screen.findByRole('button', { name: /remove request body/i })
    await fireEvent.click(removeBtn)

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })
})
