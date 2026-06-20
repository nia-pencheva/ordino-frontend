export interface LossReasonsPage {
    lossReasons: LossReason[]
    totalElements: number
    totalPages: number
}

export interface LossReason {
    id: number
    reason: string
    deleteForbiddenReasons: string[]
}
