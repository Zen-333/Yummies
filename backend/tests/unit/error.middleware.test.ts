import { describe, it, expect, vi } from 'vitest'
import type { Request, NextFunction } from 'express'
import { errorHandler } from '../../src/middleware/error.middleware'
import { createMockResponse } from '../helpers/expressMock'

describe('errorHandler', () => {
  it('responds with a generic 500 and logs the error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const req = {} as Request
    const res = createMockResponse()
    const next = vi.fn() as unknown as NextFunction

    errorHandler(new Error('boom'), req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
    })
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('forwards to next if headers were already sent', () => {
    const req = {} as Request
    const res = createMockResponse()
    res.headersSent = true
    const next = vi.fn() as unknown as NextFunction

    errorHandler(new Error('boom'), req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(res.status).not.toHaveBeenCalled()
  })
})