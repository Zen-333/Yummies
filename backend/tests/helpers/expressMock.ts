import { vi } from 'vitest'
import type { Response } from 'express'

export function createMockResponse(): Response {
  const res: Partial<Response> = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res as Response
}