<template>
    <TheLayout>
        <TheTitle>Inventory Loss by Reason</TheTitle>

        <div class="inventory-loss-report-view__filters__wrapper">
            <div class="inventory-loss-report-view__filters">
                <div class="inventory-loss-report-view__filter-group">
                    <label class="inventory-loss-report-view__filter-label">From</label>
                    <input
                        v-model="fromInput"
                        type="datetime-local"
                        class="inventory-loss-report-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <div class="inventory-loss-report-view__filter-group">
                    <label class="inventory-loss-report-view__filter-label">To</label>
                    <input
                        v-model="toInput"
                        type="datetime-local"
                        class="inventory-loss-report-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <TheButton
                    v-if="fromInput !== initialFrom || toInput !== initialTo"
                    class="inventory-loss-report-view__clear-button"
                    @click="clearFilters"
                >
                    Clear
                </TheButton>
            </div>

            <p v-if="filterError" class="inventory-loss-report-view__field-error">{{ filterError }}</p>
        </div>

        <div class="inventory-loss-report-view__results">
            <div v-if="loading" class="inventory-loss-report-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div
                    v-if="!filterError && report?.dataPoints.length"
                    class="inventory-loss-report-view__chart__wrapper"
                >
                    <canvas ref="chartCanvas" class="inventory-loss-report-view__chart"></canvas>
                </div>

                <div
                    v-else
                    class="inventory-loss-report-view__empty"
                >
                    <p>No inventory loss data found for the specified period.</p>
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
    BarElement,
    BarController,
    Tooltip,
    Legend
} from 'chart.js'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import type { InventoryLossReport } from '@/components/reports/inventory-loss-report-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import TheButton from '@/components/base/TheButton.vue'

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend)

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

const report = ref<InventoryLossReport | null>(null)
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
        report.value = await new APICall<InventoryLossReport>(`reports/inventory-loss${query}`).execute()
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

    const labels = report.value.dataPoints.map(dp => dp.reason)
    const data = report.value.dataPoints.map(dp => dp.count)

    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Occurrences',
                data,
                backgroundColor: 'rgba(210, 80, 70, 0.75)',
                borderColor: 'rgba(190, 50, 40, 0.9)',
                borderWidth: 1,
                borderRadius: 3,
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
                        label: (ctx) => ` ${ctx.parsed.y} times`
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
                        precision: 0,
                        callback: (val) => `${Number(val)} ${(Number(val) === 1) ? 'time' : 'times'}`
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
    .inventory-loss-report-view__filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .inventory-loss-report-view__filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .inventory-loss-report-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .inventory-loss-report-view__filter-label {
        font-size: 13px;
        color: #444;
    }

    .inventory-loss-report-view__datetime-input {
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

    .inventory-loss-report-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .inventory-loss-report-view__field-error {
        color: $fontColorError;
        font-size: 12px;
        margin: 0;
    }

    .inventory-loss-report-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .inventory-loss-report-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .inventory-loss-report-view__chart__wrapper {
        flex: 1;
        position: relative;
        min-height: 420px;
        background-color: #fff;
    }

    .inventory-loss-report-view__chart {
        width: 100% !important;
        height: 100% !important;
    }

    .inventory-loss-report-view__empty {
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
