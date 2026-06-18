import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextFunction } from 'express'
import { requireAuth } from '../../src/middleware/auth.middleware'
import type { AuthRequest } from '../../src/middleware/auth.middleware'
import { supabase } from '../../src/lib/supabase'
import { createMockResponse } from '../helpers/expressMock'

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}))

describe('requireAuth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects requests with no Authorization header', async () => {
    const req = { headers: {} } as unknown as AuthRequest
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    await requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects a malformed Authorization header (no Bearer prefix)', async () => {
    const req = { headers: { authorization: 'bad-token' } } as unknown as AuthRequest
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    await requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects an invalid or expired token', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: { message: 'invalid token' },
    } as any)

    const req = { headers: { authorization: 'Bearer bad-token' } } as unknown as AuthRequest
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    await requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('attaches userId to the request and calls next() for a valid token', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any)

    const req = { headers: { authorization: 'Bearer good-token' } } as unknown as AuthRequest
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    await requireAuth(req, res, next)

    expect(req.userId).toBe('user-123')
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })
})