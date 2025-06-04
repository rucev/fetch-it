declare let expect: any
import { render, screen } from '@testing-library/vue'
import Footer from '../../src/components/Footer.vue'
import { describe, it } from 'vitest'

describe('Footer', () => {
  it('renders the footer with the corresponding main styles', async () => {
    render(Footer)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('mt-5', 'pb-2', 'w-full', 'px-4', 'flex', 'flex-col', 'items-center')

  })
})
