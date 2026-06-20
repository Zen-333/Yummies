import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAllRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from '../../src/controllers/recipe.controller'
import { supabase } from '../../src/lib/supabase'
import { createSupabaseQueryMock } from '../helpers/supabaseMock'
import { createMockResponse } from '../helpers/expressMock'
import type { AuthRequest } from '../../src/middleware/auth.middleware'

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('recipe.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllRecipe', () => {
    it('returns the recipes belonging to the authenticated user', async () => {
      const mockRecipes = [{ id: '1', name: 'Pancakes', user_id: 'user-123' }]
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: mockRecipes, error: null })
      )

      const req = { userId: 'user-123' } as unknown as AuthRequest
      const res = createMockResponse()

      await getAllRecipe(req, res)

      expect(supabase.from).toHaveBeenCalledWith('recipes')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Get all recipes',
        recipes: mockRecipes,
      })
    })

    it('returns a 500 when Supabase returns an error', async () => {
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: null, error: { message: 'DB unreachable' } })
      )

      const req = { userId: 'user-123' } as unknown as AuthRequest
      const res = createMockResponse()

      await getAllRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB unreachable',
      })
    })
  })

  describe('addRecipe', () => {
    it('rejects a blank name and never touches Supabase', async () => {
      const req = { body: { name: '   ' }, userId: 'user-123' } as unknown as AuthRequest
      const res = createMockResponse()

      await addRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(supabase.from).not.toHaveBeenCalled()
    })

    it('creates a recipe and returns 201', async () => {
      const newRecipe = { id: '2', name: 'Omelette', user_id: 'user-123' }
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: newRecipe, error: null })
      )

      const req = {
        body: { name: 'Omelette', ingredients: ['eggs'] },
        userId: 'user-123',
      } as unknown as AuthRequest
      const res = createMockResponse()

      await addRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Recipe added',
        recipe: newRecipe,
      })
    })

    it('returns 500 when Supabase fails to insert the recipe', async () => {
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: null, error: { message: 'Insert failed' } })
      )

      const req = {
        body: { name: 'Omelette' },
        userId: 'user-123',
      } as unknown as AuthRequest
      const res = createMockResponse()

      await addRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insert failed',
      })
    })
  })

  describe('updateRecipe', () => {
    it('returns 404 when the recipe does not belong to the user (ownership check)', async () => {
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: null, error: { message: 'No rows found' } })
      )

      const req = {
        params: { id: 'recipe-1' },
        body: { name: 'Updated name' },
        userId: 'someone-elses-id',
      } as unknown as AuthRequest
      const res = createMockResponse()

      await updateRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('updates a recipe owned by the user and returns 200', async () => {
      const updated = { id: 'recipe-1', name: 'Updated name', user_id: 'user-123' }
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: updated, error: null })
      )

      const req = {
        params: { id: 'recipe-1' },
        body: { name: 'Updated name' },
        userId: 'user-123',
      } as unknown as AuthRequest
      const res = createMockResponse()

      await updateRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Recipe updated successfully',
        recipe: updated,
      })
    })
  })

  describe('deleteRecipe', () => {
    it('deletes a recipe owned by the user', async () => {
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: null, error: null })
      )

      const req = { params: { id: 'recipe-1' }, userId: 'user-123' } as unknown as AuthRequest
      const res = createMockResponse()

      await deleteRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'recipe deleted',
        id: 'recipe-1',
      })
    })

    it('returns 404 when Supabase fails to delete the recipe', async () => {
      vi.mocked(supabase.from).mockReturnValue(
        createSupabaseQueryMock({ data: null, error: { message: 'Delete failed' } })
      )

      const req = { params: { id: 'recipe-1' }, userId: 'user-123' } as unknown as AuthRequest
      const res = createMockResponse()

      await deleteRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid recipe ID',
        id: 'recipe-1',
      })
    })
  })
})