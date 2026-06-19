import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import type { NextFunction, Request } from 'express'
import { validateBody } from '../../src/middleware/validate.middleware'
import { createMockResponse } from '../helpers/expressMock'

describe('validateBody middleware', () => {
  const schema = z.object({
    name: z.string().trim().min(1),
    cost: z.number().min(0).optional(),
  })

  it('calls next() and passes through valid data', () => {
    const req = { body: { name: 'Pancakes', cost: 5 } } as unknown as Request
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    validateBody(schema)(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('returns 400 when a required field is missing', () => {
    const req = { body: { cost: 5 } } as unknown as Request
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    validateBody(schema)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('strips unrecognized fields instead of passing them through', () => {
    const req = {
      body: { name: 'Pancakes', user_id: 'attacker-controlled-id' },
    } as unknown as Request
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    validateBody(schema)(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect((req.body as any).user_id).toBeUndefined()
  })
})