export interface UnitsPage {
    unitCategories: UnitCategoryForUnitsPage[]
    totalElements: number
    totalPages: number
}

export interface UnitCategoryForUnitsPage {
    id: number,
    category: string,
    units: UnitForUnitsPage[],
    canBeDeleted: boolean
}

export interface UnitForUnitsPage {
    id: number
    unit: string
    abbreviation: string
    categoryId: number;
    deleteForbiddenReasons: string[]
}

export interface UnitCategoryForEditing {
    id: number,
    category: string
}

export interface UnitCategoryForEditUnitResponse {
    id: number,
    category: string
}

export interface EditUnitResponse {
    id: number
    unit: string
    abbreviation: string
    categoryId: number;
    allUnitCategories: UnitCategoryForEditUnitResponse[]
}
