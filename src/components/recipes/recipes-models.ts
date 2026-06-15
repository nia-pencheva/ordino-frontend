import type { RecipeReviewReturnedForRevisionLogEntry } from '@/components/recipes/log/recipe-log-models'

export interface RecipesPage {
    recipes: Recipe[]
    totalElements: number
    totalPages: number
}

export interface Recipe {
    id: number
    title: string
    status: string
}

export interface RecipeProduct {
    id: number
    name: string
    quantity: number
    unit: RecipeProductUnit
    position: number
}

export interface RecipeProductUnit {
    id: number
    unit: string
    abbreviation: string
}

export interface RecipeCategory {
    id: number
    name: string
}

export interface RecipeDetail {
    id: number
    title: string | null
    preparationTime: number | null
    servings: number | null
    instructions: string | null
    notes: string | null
    description: string | null
    status: string
    createdByFullName: string
    createdByCurrentUser: boolean
    approvedByFullName: string | null
    products: RecipeProduct[]
    recipeCategories: RecipeCategory[]
    revisionNotes: RecipeReviewReturnedForRevisionLogEntry[]
}

export interface ProductForSelect {
    id: number
    name: string
}

export interface ProductCategoryForSelect {
    id: number
    category: string
    subCategories: ProductCategoryForSelect[]
    products: ProductForSelect[]
}

export interface UnitForSelect {
    id: number
    unit: string
    abbreviation: string
}

export interface UnitCategoryForSelect {
    id: number
    category: string
    units: UnitForSelect[]
}

export interface RecipeEditData {
    productCategories: ProductCategoryForSelect[]
    unitCategories: UnitCategoryForSelect[]
}

export interface RecipeForEditingResponse extends RecipeEditData {
    recipe: RecipeDetail
}

export interface Instruction {
    text: string
}

export interface EditRecipeProduct {
    productId: number
    position: number
    quantity: number | null
    unitId: number | null
    name: string
}
