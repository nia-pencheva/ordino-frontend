export interface ProductOrderDataPoint {
    productName: string
    orderCount: number
}

export interface TopOrderedProductsReport {
    items: ProductOrderDataPoint[]
    totalElements: number
    totalPages: number
    page: number
}
