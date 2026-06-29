export interface LossDataPoint {
    reason: string
    count: number
}

export interface InventoryLossReport {
    dataPoints: LossDataPoint[]
}
