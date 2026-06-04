export interface Product {
    id: number,
    name: string,
    notes: string,
    active: boolean,
    deactivateForbiddenReasons: string[],
    deleteForbiddenReasons: string[]
}