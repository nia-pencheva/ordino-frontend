export interface SuppliersPage {
    suppliers: SupplierForPage[]
    totalElements: number
    totalPages: number
}

export interface SupplierForPage {
    id: number
    name: string
}

export interface Supplier {
    id: number
    name: string
    address: string
    email: string
    phoneNumber: string
    active: boolean
    deleteForbiddenReasons: string[]
}

export interface SupplierProduct {
    id: number
    warehouseProductId: number
    productName: string
    unitAbbreviation: string
    price: number
    minOrderQuantity: number
}

export interface SupplierProductInfo {
    product: SupplierProduct
    supplierName: string
}

export interface SupplierProductsPage {
    products: SupplierProduct[]
    totalElements: number
    totalPages: number
}

export interface SupplierOrder {
    id: number
    createdAt: string
}

export interface SupplierOrdersPage {
    orders: SupplierOrder[]
    totalElements: number
    totalPages: number
}

export interface AddableWarehouseProduct {
    id: number
    name: string
    unitAbbreviation: string
}

export interface AddableWarehouseProductsPage {
    products: AddableWarehouseProduct[]
    totalElements: number
    totalPages: number
}
