export interface RecipeIngredientCategory {
    id: number
    category: string
    subCategories?: RecipeIngredientCategory[]
    products?: RecipeIngredientCategoryProduct[]
}

export interface RecipeIngredientCategoryProduct {
    id: number
    name: string
}

export interface RecipeIngredientCategoryForEditing {
    id: number,
    category: string,
    parentCategoryId: number
}
