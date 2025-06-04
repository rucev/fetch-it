declare let expect: any
import { describe, it, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen, waitFor } from '@testing-library/vue'
import App from '../src/App.vue'
import { nextTick } from 'vue'

vi.mock('../src/components/index.ts', () => ({
  DisplayResponse: {
    template: `<div v-if="response" data-testid="display-response">{{ response.body }}</div>`,
    props: ['response'],
    setup(props) {
      return {
        response: props.response,
      }
    }
  },
  DisplayCurl: {
    template: `<div v-if="curl" data-testid="display-curl">{{ curl }}</div>`,
    props: ['curl'],
    setup(props) {
      return {
        curl: props.curl,
      }
    }
  },
  RequestForm: {
    template: `<div data-testid="request-form"></div>`
  },
  OptionsMenu: {
    template: `
      <div>
        <button @click="$emit('submitFetch')" aria-label="Submit fetch">Fetch</button>
        <button @click="$emit('submitCurl')" aria-label="Generate Curl">Curl</button>
        <button @click="$emit('resetCall')" aria-label="Reset call">Reset</button>
        <button @click="$emit('saveCall')" aria-label="Save call">Save</button>
      </div>`
  },
  LateralBar: {
    template: `<div><button @click="$emit('loadCall', 'test-id')" aria-label="Load call">Load Call</button></div>`
  },
  Footer: {
    template: `<footer>Footer</footer>`
  }
}))


vi.mock('../src/repository/index.ts', () => {
  return {
    calls: {
      repository: vi.fn().mockImplementation(() => ({
        saveCall: vi.fn(),
        loadCallById: vi.fn(() => ({
          id: 'test-id',
          url: 'https://example.com',
          method: 'GET',
          headers: [],
          body: '',
          response: 'response'
        }))
      })),
      mapper: {
        toPersistence: vi.fn((options, response) => ({ ...options, response })),
        toDomain: vi.fn(() => [
          { url: 'https://example.com', method: 'GET', headers: [], body: '' },
          { status: 200, body: 'test response' }
        ])
      }
    }
  }
})


describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders main title and footer', () => {
    render(App)
    expect(screen.getByText(/Fetch It/i)).toBeInTheDocument()
    expect(screen.getByText(/Footer/i)).toBeInTheDocument()
  })

  it('resets the call', async () => {
    render(App)

    const resetButton = screen.getByRole('button', { name: /reset call/i })
    await fireEvent.click(resetButton)

    expect(screen.queryByTestId('display-response')).not.toBeInTheDocument()
  })

  it('loads a call by ID and shows response', async () => {
    render(App)

    const loadButton = screen.getByRole('button', { name: /load call/i })
    await fireEvent.click(loadButton)

    expect(await screen.findByTestId('display-response')).toBeInTheDocument()
    expect(await screen.findByTestId('display-response')).toHaveTextContent('test response')
  })
})

