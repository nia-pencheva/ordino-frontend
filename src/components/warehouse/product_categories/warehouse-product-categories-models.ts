export interface WarehouseProductCategory {
    id: number
    category: string
    subCategories?: WarehouseProductCategory[]
    products?: WarehouseProductCategoryProduct[]
}

export interface WarehouseProductCategoryProduct {
    id: number
    name: string
}

export interface WarehouseProductCategoryForEditing {
    id: number,
    category: string,
    parentCategoryId: number
}
