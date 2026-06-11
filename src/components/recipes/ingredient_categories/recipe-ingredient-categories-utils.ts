import { APICall } from "@/service/api/api";
import { RecipeIngredientCategory, RecipeIngredientCategoryForEditing } from "./recipe-ingredient-categories-models";

export async function fetchRecipeIngredientCategories() {
    return await (new APICall<RecipeIngredientCategory[]>('recipe-ingredient-categories')).execute();
}

export function fetchRecipeIngredientCategoryForEditing(id: number): Promise<RecipeIngredientCategoryForEditing> {
    return (new APICall<RecipeIngredientCategoryForEditing>(`recipe-ingredient-categories/${id}`)).execute();
}

export function findCategoryById(list: RecipeIngredientCategory[], id: number): RecipeIngredientCategory | undefined {
    for (const cat of list) {
        if (cat.id === id) return cat;
        const found = findCategoryById(cat.subCategories ?? [], id);
        if (found) return found;
    }
    return undefined;
}

export function findParentById(
    list: RecipeIngredientCategory[],
    id: number,
    parent: RecipeIngredientCategory | null = null
): RecipeIngredientCategory | null {
    for (const cat of list) {
        if (cat.id === id) return parent;
        const found = findParentById(cat.subCategories ?? [], id, cat);
        if (found !== null) return found;
    }
    return null;
}