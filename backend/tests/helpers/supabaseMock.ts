import { vi } from 'vitest'

export interface SupabaseResult<T = unknown> {
  data: T | null
  error: { message: string } | null
}

export function createSupabaseQueryMock<T = unknown>(result: SupabaseResult<T>) {
  const builder: any = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
    then: (
      onFulfilled: (value: SupabaseResult<T>) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return builder
}