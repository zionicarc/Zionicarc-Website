/**
 * Admin panel tests – no Firebase is used or modified.
 * All Firebase and SiteContext are mocked; Save is not clicked.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'

const mockUpdateSettings = vi.fn()
const mockNavigate = vi.fn()

const mockSettings = {
  showServices: true,
  services: {
    title: 'Our Services',
    caption: 'Test caption.',
    items: [
      { title: 'Interior Design', desc: 'Description one.', img: '' },
      { title: 'Fellowship and Mentorship', desc: 'Description two.', img: 'https://example.com/old.jpg' },
    ],
  },
}

vi.mock('../context/SiteContext', () => ({
  useSite: () => ({
    settings: mockSettings,
    updateSettings: mockUpdateSettings,
    loading: false,
  }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../lib/firebase', () => ({
  auth: null,
}))

describe('AdminDashboard – Services section (no Firebase write)', () => {
  beforeEach(() => {
    mockUpdateSettings.mockClear()
    mockNavigate.mockClear()
  })

  it('shows dashboard when auth is not configured (local dev)', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/Z'IONIC ARC Admin/i)).toBeInTheDocument()
    })
  })

  it('Services tab shows Section Title, Caption, and Service Items with Image URL fields', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/Z'IONIC ARC Admin/i)).toBeInTheDocument()
    })

    const servicesTab = screen.getByRole('button', { name: /Services/i })
    fireEvent.click(servicesTab)

    expect(screen.getByText('Services Section')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Our Services')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test caption.')).toBeInTheDocument()

    const imageUrlLabels = screen.getAllByText('Image URL')
    expect(imageUrlLabels.length).toBeGreaterThanOrEqual(2)

    const helperText = screen.getAllByText(/Paste an Unsplash link or any direct image URL/i)
    expect(helperText.length).toBeGreaterThanOrEqual(2)
  })

  it('allows editing Image URL in Services without calling updateSettings (no Save)', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/Z'IONIC ARC Admin/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Services/i }))

    const imgInputs = screen.getAllByPlaceholderText(/unsplash|image URL/i)
    expect(imgInputs.length).toBeGreaterThanOrEqual(2)

    const secondImgInput = imgInputs[1]
    expect(secondImgInput).toHaveValue('https://example.com/old.jpg')

    fireEvent.change(secondImgInput, { target: { value: 'https://images.unsplash.com/photo-test' } })

    expect(secondImgInput).toHaveValue('https://images.unsplash.com/photo-test')
    expect(mockUpdateSettings).not.toHaveBeenCalled()
  })

  it('Add Service button is present in Services tab', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/Z'IONIC ARC Admin/i)).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /Services/i }))
    expect(screen.getByRole('button', { name: /Add Service/i })).toBeInTheDocument()
  })
})
