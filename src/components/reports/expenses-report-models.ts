export interface ExpensesDataPoint {
    date: string
    total: number
}

export interface ExpensesReport {
    dataPoints: ExpensesDataPoint[]
}
