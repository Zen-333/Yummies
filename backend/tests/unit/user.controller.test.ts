import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteAccount } from '../../src/controllers/user.controller'
import { supabase } from '../../src/lib/supabase'
import { createMockResponse } from '../helpers/expressMock'
import type { AuthRequest } from '../../src/middleware/auth.middleware'

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      admin: {
        deleteUser: vi.fn(),
      },
    },
  },
}))

describe('deleteAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when there is no authenticated user on the request', async () => {
    const req = {} as unknown as AuthRequest
    const res = createMockResponse()

    await deleteAccount(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(supabase.auth.admin.deleteUser).not.toHaveBeenCalled()
  })

  it('deletes the account and returns 200', async () => {
    vi.mocked(supabase.auth.admin.deleteUser).mockResolvedValue({
      data: { user: {} },
      error: null,
    } as any)

    const req = { userId: 'user-123' } as unknown as AuthRequest
    const res = createMockResponse()

    await deleteAccount(req, res)

    expect(supabase.auth.admin.deleteUser).toHaveBeenCalledWith('user-123')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 500 when Supabase fails to delete the user', async () => {
    vi.mocked(supabase.auth.admin.deleteUser).mockResolvedValue({
      data: null,
      error: { message: 'Something went wrong' },
    } as any)

    const req = { userId: 'user-123' } as unknown as AuthRequest
    const res = createMockResponse()

    await deleteAccount(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})