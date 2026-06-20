import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../src/App'
import { supabase } from '../../src/lib/supabase'
import { createSupabaseQueryMock } from '../helpers/supabaseMock'

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}))

describe('GET /api/recipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 with no Authorization header', async () => {
    const response = await request(app).get('/api/recipe')
    expect(response.status).toBe(401)
  })

  it('returns the recipes for an authenticated user', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any)

    vi.mocked(supabase.from).mockReturnValue(
      createSupabaseQueryMock({
        data: [{ id: '1', name: 'Pancakes' }],
        error: null,
      })
    )

   const response = await request(app)
      .get('/api/recipe')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(200)
    expect(response.body.recipes).toHaveLength(1)
  })

  it('returns 500 via the centralized error handler when an unexpected exception is thrown', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any)

    vi.mocked(supabase.from).mockImplementation(() => {
      throw new Error('Unexpected failure')
    })

    const response = await request(app)
      .get('/api/recipe')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
    })
  })
})