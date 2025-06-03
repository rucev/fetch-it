declare let expect: any //to ignore "Cannot find name 'expect'.ts(2304)" for jest-dom expect even though is declared as global through vitestSetup 
import { render, fireEvent } from '@testing-library/vue'
import { describe, it, vi } from 'vitest'
import OptionsBtn from '../../../src/components/options/OptionsBtn.vue'


describe('OptionsBtn', () => {
  it('renders with given props', () => {
    const { getByRole } = render(OptionsBtn, {
      props: {
        disabled: false,
        onClick: vi.fn(),
        srOnly: 'Screen reader label',
        text: 'Click me',
        iconClass: 'pi-check'
      }
    })

    const button = getByRole('button', { name: 'Screen reader label' })
    expect(button).toBeTruthy()
    expect(button).not.toHaveAttribute('disabled')
    expect(button.ariaDisabled).toBe('false')
    expect(button).toHaveAttribute('tabindex', '0')
    expect(button).toHaveClass(
      'flex',
      'flex-row',
      'gap-2',
      'bg-gray-300',
      'text-stone-800',
      'font-bold',
      'py-2',
      'px-4',
      'rounded',
      'items-center',
      'hover:bg-gray-200',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-gray-400',
      'cursor-pointer'
    )

    const icon = button.querySelector('i')

    expect(icon).not.toBeNull()
    expect(icon).toHaveClass('pi-check')
  })

  it('calls onClick when clicked and not disabled', async () => {
    const onClick = vi.fn()
    const { getByRole } = render(OptionsBtn, {
      props: {
        disabled: false,
        onClick,
        srOnly: 'Label',
        text: 'Text-Test',
        iconClass: 'pi-icon'
      }
    })

    const button = getByRole('button', { name: 'Label' })
    await fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    const { getByRole } = render(OptionsBtn, {
      props: {
        disabled: true,
        onClick,
        srOnly: 'Label',
        text: 'Text',
        iconClass: 'pi-icon'
      }
    })

    const button = getByRole('button', { name: 'Label' })

    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveClass('opacity-20', 'cursor-default')
    expect(button).toHaveAttribute('tabindex', '-1')

    await fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
