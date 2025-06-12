declare let expect: any
import { render, fireEvent, screen } from '@testing-library/vue'
import LateralBar from '../../src/components/LateralBar.vue'
import { vi, describe, it, beforeEach, Mock } from 'vitest'

vi.mock('../../src/repository/CallsRepository', () => ({
  default: vi.fn().mockImplementation(() => ({
    getAllCalls: vi.fn(() => [
      { name: 'Mock Call', fetchId: 'abc123' }, { name: 'Another Call', fetchId: '123abc' }
    ]),
    deleteCallById: vi.fn(),
    getAllCallsToDownload: vi.fn()
  }))
}))

globalThis.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-url')
globalThis.URL.revokeObjectURL = vi.fn()

import CallsRepository from '../../src/repository/CallsRepository'

describe('LateralBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders toggle button with correct icon and aria attributes', async () => {
    render(LateralBar)

    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')

    await fireEvent.click(toggleBtn)

    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    const sidebar = screen.getByRole('region', { name: /saved calls sidebar/i })
    expect(sidebar).toBeInTheDocument()
  })

  it('displays saved calls from the repository when sidebar is opened', async () => {
    render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })

    await fireEvent.click(toggleBtn)

    const deleteButtons = screen.getAllByRole('button', { name: /delete saved call/i })

    expect(screen.getByText('Mock Call')).toBeInTheDocument()
    expect(screen.getByText('Another Call')).toBeInTheDocument()
    expect(deleteButtons.length).toBe(2)
  })

  it('calls "deleteCallById" and updates list when delete button is clicked', async () => {
    render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })
    await fireEvent.click(toggleBtn)

    const deleteButtons = screen.getAllByRole('button', { name: /delete saved call/i })
    expect(deleteButtons.length).toBeGreaterThan(0)

    await fireEvent.click(deleteButtons[0])
    const mockInstance = (CallsRepository as Mock).mock.results[0].value
    expect(mockInstance.deleteCallById).toHaveBeenCalled()
  })

  it('emits "loadCall" and closes sidebar when a call is clicked', async () => {
    const { emitted } = render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })

    await fireEvent.click(toggleBtn)
    const loadButton = screen.getByRole('button', { name: /load saved call Mock Call/i })
    await fireEvent.click(loadButton)

    expect(emitted()).toHaveProperty('loadCall')
    expect(emitted().loadCall[0]).toEqual(['abc123'])
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('calls "onExportClick" and updates list when delete button is clicked', async () => {
    render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })
    await fireEvent.click(toggleBtn)

    const exportBtn = screen.getAllByRole('button', { name: /Export saved calls to a json file/i })
    expect(exportBtn.length).toBe(1)

    await fireEvent.click(exportBtn[0])
    const mockInstance = (CallsRepository as Mock).mock.results[0].value
    expect(mockInstance.getAllCallsToDownload).toHaveBeenCalled()
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('closes sidebar on Escape key press', async () => {
    render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })
    await fireEvent.click(toggleBtn)

    expect(screen.getByRole('region')).toBeInTheDocument()
    await fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('closes sidebar on outside click', async () => {
    render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })
    await fireEvent.click(toggleBtn)

    await fireEvent.click(document.body)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('applies correct Tailwind classes to sidebar container', async () => {
    render(LateralBar)
    const toggleBtn = screen.getByRole('button', { name: /toggle saved calls menu/i })
    await fireEvent.click(toggleBtn)

    const aside = screen.getByRole('region')
    expect(aside).toHaveClass('saved-calls-container', 'absolute', 'z-40')
  })
})
