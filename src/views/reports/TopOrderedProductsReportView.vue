<template>
    <TheLayout>
        <TheTitle>Most Ordered Products</TheTitle>

        <div class="top-ordered-report-view__filters__wrapper">
            <div class="top-ordered-report-view__filters">
                <div class="top-ordered-report-view__filter-group">
                    <label class="top-ordered-report-view__filter-label">From</label>
                    <input
                        v-model="fromInput"
                        type="datetime-local"
                        class="top-ordered-report-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <div class="top-ordered-report-view__filter-group">
                    <label class="top-ordered-report-view__filter-label">To</label>
                    <input
                        v-model="toInput"
                        type="datetime-local"
                        class="top-ordered-report-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <TheButton
                    v-if="fromInput !== initialFrom || toInput !== initialTo"
                    class="top-ordered-report-view__clear-button"
                    @click="clearFilters"
                >
                    Clear
                </TheButton>
            </div>

            <p v-if="filterError" class="top-ordered-report-view__field-error">{{ filterError }}</p>
        </div>

        <div class="top-ordered-report-view__results">
            <div v-if="!loaded" class="top-ordered-report-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div
                    v-if="!filterError && report!.items.length"
                    class="top-ordered-report-view__list-and-pager__wrapper"
                >
                    <div class="top-ordered-report-view__list__wrapper">
                        <div class="top-ordered-report-view__list-header">
                            <span class="top-ordered-report-view__list-header__rank">#</span>
                            <span class="top-ordered-report-view__list-header__name">Product</span>
                            <span class="top-ordered-report-view__list-header__count">Times Ordered</span>
                        </div>

                        <div
                            v-for="(item, index) in report!.items"
                            :key="item.productName"
                            class="top-ordered-report-view__list-item"
                        >
                            <span class="top-ordered-report-view__list-item__rank">{{ (currentPage - 1) * PAGE_SIZE + index + 1 }}</span>
                            <span class="top-ordered-report-view__list-item__name">{{ item.productName }}</span>
                            <span class="top-ordered-report-view__list-item__count">{{ item.orderCount }}</span>
                        </div>
                    </div>

                    <ThePager
                        v-if="(report!.totalElements ?? 0) > PAGE_SIZE"
                        class="top-ordered-report-view__pager"
                        :current-page="currentPage"
                        :total-pages="report!.totalPages"
                        @previous="getPreviousPage"
                        @next="getNextPage"
                    />
                </div>

                <div
                    v-else
                    class="top-ordered-report-view__empty"
                >
                    <p>No order data found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import type { TopOrderedProductsReport } from '@/components/reports/top-ordered-products-report-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import TheButton from '@/components/base/TheButton.vue'
import ThePager from '@/components/base/ThePager.vue'

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
const PAGE_SIZE = 10

const report = ref<TopOrderedProductsReport | null>(null)
const currentPage = ref(1)
const fromInput = ref(initialFrom)
const toInput = ref(initialTo)
const filterError = ref<string | null>(null)

const loaded = computed(() => report.value !== null)

async function fetchReport() {
    report.value = null
    filterError.value = null

    try {
        const params = new URLSearchParams()
        if (fromInput.value) params.set('from', new Date(fromInput.value).toISOString())
        if (toInput.value) params.set('to', new Date(toInput.value).toISOString())
        params.set('page', String(currentPage.value - 1))
        params.set('size', String(PAGE_SIZE))

        report.value = await new APICall<TopOrderedProductsReport>(`reports/top-ordered-products?${params}`).execute()
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            filterError.value = e.getByField('from')[0]?.message ?? null
        }
    }
}

async function getNextPage() {
    currentPage.value++
    await fetchReport()
}

async function getPreviousPage() {
    currentPage.value--
    await fetchReport()
}

function onFilterChange() {
    currentPage.value = 1
    fetchReport()
}

function clearFilters() {
    fromInput.value = initialFrom
    toInput.value = initialTo
    filterError.value = null
    currentPage.value = 1
    fetchReport()
}

fetchReport()
</script>

<style lang="scss">
    .top-ordered-report-view__filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .top-ordered-report-view__filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .top-ordered-report-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .top-ordered-report-view__datetime-input {
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

    .top-ordered-report-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .top-ordered-report-view__field-error {
        color: $fontColorError;
        font-size: 12px;
        margin: 0;
    }

    .top-ordered-report-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .top-ordered-report-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .top-ordered-report-view__list-and-pager__wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .top-ordered-report-view__list__wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        min-height: 500px;
    }

    .top-ordered-report-view__list-header {
        display: grid;
        grid-template-columns: 30px 1fr 140px;
        width: 100%;
        font-weight: bold;
        border-bottom: 1px solid #d3d3d3;
        padding: 10px;
    }

    .top-ordered-report-view__list-header__count {
        text-align: right;
    }

    .top-ordered-report-view__list-item {
        display: grid;
        grid-template-columns: 48px 1fr 140px;
        padding: 15px;
        width: 100%;
        background-color: #fff;
        border-top: none;

        &:last-of-type {
            border-radius: 0 0 4px 4px;
        }

        &:nth-child(even) {
            background-color: $lightGray;
        }
    }

    .top-ordered-report-view__list-item__rank {
        font-weight: bold;
    }

    .top-ordered-report-view__list-item__name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .top-ordered-report-view__list-item__count {
        text-align: right;
    }

    .top-ordered-report-view__empty {
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
