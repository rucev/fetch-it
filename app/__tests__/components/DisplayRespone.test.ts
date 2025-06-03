declare let expect: any
import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, it } from 'vitest'
import DisplayResponse from '../../src/components/DisplayResponse.vue'
import type { ResponseToDisplay } from '../../src/interfaces/interfaces'

describe('DisplayResponse', () => {
  const mockResponse: ResponseToDisplay = {
    statusCode: 200,
    statusMsg: 'OK',
    headers: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'X-Test-Header', value: 'TestValue' },
    ],
    body: { success: true, data: [1, 2, 3] },
  }

  it('does not render anything if no response is provided', () => {
    const { container } = render(DisplayResponse, {
      props: { response: undefined }
    })
    expect(container.textContent).toContain('Hide')
  })

  it('renders status and headers/body correctly', () => {
    render(DisplayResponse, {
      props: { response: mockResponse }
    })

    expect(screen.getByRole('status')).toHaveTextContent('200 - OK')
    expect(screen.getByText('Content-Type:')).toBeTruthy()
    expect(screen.getByText('application/json')).toBeTruthy()
    expect(screen.getByText('X-Test-Header:')).toBeTruthy()
    expect(screen.getByText('TestValue')).toBeTruthy()
    expect(screen.getByText(/success/)).toBeTruthy()
  })

  it('applies correct color class based on status code', async () => {
    const { rerender } = render(DisplayResponse, {
      props: {
        response: { ...mockResponse, statusCode: 404, statusMsg: 'Not Found' }
      }
    })

    expect(screen.getByText(/404/)).toHaveClass('text-red-500')

    await rerender({ response: { ...mockResponse, statusCode: 503, statusMsg: 'Service Unavailable' } })
    expect(screen.getByText(/503/)).toHaveClass('text-yellow-500')

    await rerender({ response: { ...mockResponse, statusCode: 201, statusMsg: 'Created' } })
    expect(screen.getByText(/201/)).toHaveClass('text-green-500')
  })

  it('applies all class names to button', async () => {
    render(DisplayResponse, {
      props: { response: mockResponse }
    })

    const toggleBtn = screen.getByRole('button')

    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    expect(toggleBtn.querySelector('i')).toHaveClass('pi-eye-slash', 'pi')
    expect(toggleBtn.textContent).toContain('Hide')

    expect(toggleBtn).toHaveClass('response-btn')

    await fireEvent.click(toggleBtn)

    expect(toggleBtn.querySelector('i')).toHaveClass('pi-eye', 'pi')
    expect(toggleBtn.textContent).toContain('Show More')
  })

  it('toggles visibility of response details', async () => {
    render(DisplayResponse, {
      props: { response: mockResponse }
    })

    const toggleBtn = screen.getByRole('button', { name: 'Hide response details' })
    expect(screen.getByRole('region')).toBeTruthy()

    await fireEvent.click(toggleBtn)

    expect(screen.queryByRole('region')).toBeNull()

    expect(toggleBtn).toHaveTextContent('Show More')
  })
})
