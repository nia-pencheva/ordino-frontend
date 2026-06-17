export interface WarehouseProductsPage {
    warehouseProducts: WarehouseProductForPage[]
    totalElements: number
    totalPages: number
}

export interface WarehouseProductForPage {
    id: number
    name: string
}

export interface WarehouseProductsAddableProductsPage {
    products: WarehouseProductsAddableProduct[]
    totalElements: number
    totalPages: number
}

export interface WarehouseProductsAddableProduct {
    id: number
    name: string
}

export interface WarehouseProduct {
    productId: number
    productName: string
    unitId: number
    unitAbbreviation: string
    unitCategoryName: string
    minQuantity: number
    active: boolean
    deactivateForbiddenReasons: string[]
}
