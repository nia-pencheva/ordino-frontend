export interface RecipeCategoriesPage {
    recipeCategories: RecipeCategory[]
    totalElements: number
    totalPages: number
}

export interface RecipeCategory {
    id: number
    category: string
    recipesCount: number
}
