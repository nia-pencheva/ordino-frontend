export interface ProductsPage {
    products: Product[]
    totalElements: number
    totalPages: number
}

export interface Product {
    id: number,
    name: string,
    notes: string,
    active: boolean,
    deactivateForbiddenReasons: string[],
    deleteForbiddenReasons: string[]
}