export type Recipe = {
    readonly _id: string
    name: string
    notes?: string
    imagesURL?: Array<string>
    ingredients?: Array<string>
    steps?: Array<string>
}

export type NewRecipe = Omit<Recipe, '_id'> 
// this creates a new type coping all the variables inside Recipe but leaving out _id