<template>
    <TheLayout>
        <TheTitle>Expenses Report</TheTitle>

        <div class="expenses-report-view__filters__wrapper">
            <div class="expenses-report-view__filters">
                <div class="expenses-report-view__filter-group">
                    <label class="expenses-report-view__filter-label">From</label>
                    <input
                        v-model="fromInput"
                        type="datetime-local"
                        class="expenses-report-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <div class="expenses-report-view__filter-group">
                    <label class="expenses-report-view__filter-label">To</label>
                    <input
                        v-model="toInput"
                        type="datetime-local"
                        class="expenses-report-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <TheButton
                    v-if="fromInput !== initialFrom || toInput !== initialTo"
                    class="expenses-report-view__clear-button"
                    @click="clearFilters"
                >
                    Clear
                </TheButton>
            </div>

            <p v-if="filterError" class="expenses-report-view__field-error">{{ filterError }}</p>
        </div>

        <div class="expenses-report-view__results">
            <div v-if="loading" class="expenses-report-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div
                    v-if="!filterError && report?.dataPoints.length"
                    class="expenses-report-view__chart__wrapper"
                >
                    <canvas ref="chartCanvas" class="expenses-report-view__chart"></canvas>
                </div>

                <div
                    v-else
                    class="expenses-report-view__empty"
                >
                    <p>No expense data found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import {
    Chart,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    LineController,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import type { ExpensesReport } from '@/components/reports/expenses-report-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import TheButton from '@/components/base/TheButton.vue'

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Tooltip, Legend, Filler)

function toDatetimeLocalString(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function defaultFrom(): string {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return toDatetimeLocalString(d)
}

function defaultTo(): string {
    return toDatetimeLocalString(new Date())
}

const initialFrom = defaultFrom()
const initialTo = defaultTo()

const chartCanvas = ref<HTMLCanvasElement | null>(null)

const report = ref<ExpensesReport | null>(null)
const loading = ref(false)
const fromInput = ref(initialFrom)
const toInput = ref(initialTo)
const filterError = ref<string | null>(null)

let chartInstance: Chart | null = null

async function fetchReport() {
    loading.value = true
    filterError.value = null

    try {
        const params = new URLSearchParams()
        if (fromInput.value) params.set('from', new Date(fromInput.value).toISOString())
        if (toInput.value) params.set('to', new Date(toInput.value).toISOString())

        const query = params.toString() ? `?${params}` : ''
        report.value = await new APICall<ExpensesReport>(`reports/expenses${query}`).execute()
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            filterError.value = e.getByField('from')[0]?.message ?? null
        }
    } finally {
        loading.value = false
    }

    await nextTick()
    renderChart()
}

function renderChart() {
    if (!chartCanvas.value || !report.value?.dataPoints.length) return

    if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
    }

    const labels = report.value.dataPoints.map(dp => dp.date)
    const data = report.value.dataPoints.map(dp => Number(dp.total))

    chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Daily Expenses',
                data,
                borderColor: 'rgba(60, 120, 210, 0.9)',
                backgroundColor: 'rgba(60, 120, 210, 0.07)',
                fill: true,
                tension: 0.35,
                pointBackgroundColor: 'rgba(60, 120, 210, 0.9)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(100, 130, 170, 0.4)',
                    borderWidth: 1,
                    titleColor: '#333',
                    bodyColor: '#555',
                    padding: 10,
                    callbacks: {
                        label: (ctx) => ` ${Number(ctx.parsed.y).toFixed(2)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                        color: '#555',
                        font: { size: 12 },
                        maxRotation: 45,
                    },
                    border: {
                        color: 'rgba(100, 130, 170, 0.3)',
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                        color: '#555',
                        font: { size: 12 },
                        callback: (val) => `${Number(val).toFixed(2)} ${process.env.VUE_APP_CURRENCY}`
                    },
                    border: {
                        color: 'rgba(100, 130, 170, 0.3)',
                    }
                }
            }
        }
    })
}

function onFilterChange() {
    fetchReport()
}

function clearFilters() {
    fromInput.value = initialFrom
    toInput.value = initialTo
    filterError.value = null
    fetchReport()
}

onUnmounted(() => {
    chartInstance?.destroy()
})

fetchReport()
</script>

<style lang="scss">
    .expenses-report-view__filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .expenses-report-view__filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .expenses-report-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .expenses-report-view__filter-label {
        font-size: 13px;
        color: #444;
    }

    .expenses-report-view__datetime-input {
        height: 30px;
        border-radius: 3px;
        padding: 3px 8px;
        border: 1px solid rgba(100, 130, 170, 0.55);
        background-color: #fff;
        color: #1a1a1a;
        outline: none;
        font-size: 14px;

        box-shadow:
            inset 0 1px 3px rgba(0, 0, 0, 0.20),
            inset 0 1px 1px rgba(0, 0, 0, 0.12),
            0 1px 0 rgba(255, 255, 255, 0.80);

        &:focus {
            border-color: rgba(60, 120, 210, 0.90);
            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.18),
                0 0 0 2px rgba(80, 150, 230, 0.28);
        }
    }

    .expenses-report-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .expenses-report-view__field-error {
        color: $fontColorError;
        font-size: 12px;
        margin: 0;
    }

    .expenses-report-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .expenses-report-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .expenses-report-view__chart__wrapper {
        flex: 1;
        position: relative;
        min-height: 420px;
        background-color: #fff;
    }

    .expenses-report-view__chart {
        width: 100% !important;
        height: 100% !important;
    }

    .expenses-report-view__empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
