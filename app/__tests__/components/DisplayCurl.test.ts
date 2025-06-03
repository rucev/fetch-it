declare let expect: any
import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, it, vi } from 'vitest'
import DisplayCurl from '../../src/components/DisplayCurl.vue'
import { nextTick } from 'vue'

describe('DisplayCurl', () => {
  it('renders curl text when passed as string', () => {
    render(DisplayCurl, {
      props: {
        curl: 'curl https://api.example.com',
        onCloseCurl: vi.fn()
      }
    })

    const dialog = screen.getByRole('dialog')

    expect(dialog).toBeTruthy()
    expect(dialog).toHaveClass('fixed', 'inset-0', 'h-screen', 'w-screen', 'flex', 'items-center', 'justify-center', 'z-40')
    expect(dialog.ariaModal).toBe('true')

    const closeBtn = screen.getByRole('button', { name: 'Close cURL dialog' })

    expect(closeBtn).toBeTruthy()
    expect(screen.getByText('curl https://api.example.com')).toBeTruthy()
  })

  it('renders curl text when passed as array', () => {
    render(DisplayCurl, {
      props: {
        curl: ['curl', '-X', 'POST', 'https://api.example.com'],
        onCloseCurl: vi.fn()
      }
    })

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('calls onClose when close button is clicked', async () => {
    const close = vi.fn()
    render(DisplayCurl, {
      props: {
        curl: 'test',
        onCloseCurl: close
      }
    })

    const closeBtn = screen.getByRole('button', { name: 'Close cURL dialog' })

    expect(closeBtn).toBeTruthy()

    await fireEvent.click(closeBtn)

    expect(close).toHaveBeenCalled()
  })

  it('calls onClose when ESC is pressed', async () => {
    const close = vi.fn()
    render(DisplayCurl, {
      props: {
        curl: 'test',
        onCloseCurl: close
      }
    })

    await fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(close).toHaveBeenCalled()
  })


  it('copies curl to clipboard and shows "Copied!" message', async () => {
    let capturedText: string | null = null;

    const writeTextMock = vi.fn((text: string) => {
      capturedText = text;
      return Promise.resolve();
    });

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });

    const curlString = 'copy this text';

    const { container } = render(DisplayCurl, {
      props: {
        curl: curlString,
        onCloseCurl: vi.fn(),
      },
    });

    const curlDiv = container.querySelector('.curl-container > div');
    expect(curlDiv).toBeTruthy();
    expect(curlDiv?.textContent).toContain(curlString);

    await nextTick();

    const copyBtn = screen.getByRole('button', { name: 'Copy cURL to clipboard' });
    expect(copyBtn).toBeTruthy();

    await fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
    expect(capturedText).toBe(curlDiv?.textContent);
    expect(await screen.findByText('Copied!')).toBeTruthy();
  });


})