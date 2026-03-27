export type Recipe = {
    readonly _id: string
    name: string
    notes?: string
    imagesURL?: Array<string>
    ingredients?: string
    steps?: Array<string>
}

