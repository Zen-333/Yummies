export type Recipe = {
    readonly id: string
    user_id?: string
    name: string
    notes?: string
    images_url?: Array<string>
    ingredients?: Array<string>
    steps?: Array<string>
    time_hr?: number
    time_mi?: number
    cost?: number
    created_at?: string
}

export type NewRecipe = Omit<Recipe, 'id' | 'user_id' | 'created_at'>