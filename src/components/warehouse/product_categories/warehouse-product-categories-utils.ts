import { APICall } from "@/service/api/api";
import { WarehouseProductCategory, WarehouseProductCategoryForEditing } from "./warehouse-product-categories-models";

export async function fetchWarehouseProductCategories() {
    return await (new APICall<WarehouseProductCategory[]>('warehouse-product-categories')).execute();
}

export function fetchWarehouseProductCategoryForEditing(id: number): Promise<WarehouseProductCategoryForEditing> {
    return (new APICall<WarehouseProductCategoryForEditing>(`warehouse-product-categories/${id}`)).execute();
}

export function findCategoryById(list: WarehouseProductCategory[], id: number): WarehouseProductCategory | undefined {
    for (const cat of list) {
        if (cat.id === id) return cat;
        const found = findCategoryById(cat.subCategories ?? [], id);
        if (found) return found;
    }
    return undefined;
}

export function findParentById(
    list: WarehouseProductCategory[],
    id: number,
    parent: WarehouseProductCategory | null = null
): WarehouseProductCategory | null {
    for (const cat of list) {
        if (cat.id === id) return parent;
        const found = findParentById(cat.subCategories ?? [], id, cat);
        if (found !== null) return found;
    }
    return null;
}
