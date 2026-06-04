export interface UnitsPage {
    units: Unit[]
    totalElements: number
    totalPages: number
}

export interface Unit {
    id: number
    unit: string
    abbreviation: string
    deleteForbiddenReasons: string[]
}
