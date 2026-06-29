export interface QuantitiesDataPoint {
    date: string
    expectedTotal: number
    receivedTotal: number
}

export interface OrderQuantitiesReport {
    dataPoints: QuantitiesDataPoint[]
}
