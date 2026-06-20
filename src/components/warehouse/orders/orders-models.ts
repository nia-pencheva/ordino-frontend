export interface OrderForPage {
    id: number
    createdAt: string
}

export interface OrdersPage {
    orders: OrderForPage[]
    totalElements: number
    totalPages: number
}

export interface OrderDetailUser {
    id: number
    fullName: string
}

export interface OrderDetailSupplier {
    id: number
    name: string
}

export interface OrderDetailProductUnit {
    id: number
    abbreviation: string
}

export interface OrderDetailProduct {
    id: number
    warehouseProductId: number
    name: string
    expectedQuantity: number
    receivedQuantity: number | null
    unit: OrderDetailProductUnit
}

export interface OrderDetail {
    id: number
    status: string
    createdAt: string
    placedBy: OrderDetailUser
    finalizedBy: OrderDetailUser | null
    supplier: OrderDetailSupplier
    expectedDelivery: string
    actualDelivery: string | null
    notes: string | null
    products: OrderDetailProduct[]
}
