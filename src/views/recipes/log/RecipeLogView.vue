<template>
    <TheLayout>
        <TheTitle>{{ recipe?.title ?? '…' }} Log</TheTitle>

        <div class="recipe-log-view__filters__wrapper">
            <div class="recipe-log-view__filters">
                <div class="recipe-log-view__filter-group">
                    <label class="recipe-log-view__filter-label">From</label>
                    <input
                        v-model="fromInput"
                        type="datetime-local"
                        class="recipe-log-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <div class="recipe-log-view__filter-group">
                    <label class="recipe-log-view__filter-label">To</label>
                    <input
                        v-model="toInput"
                        type="datetime-local"
                        class="recipe-log-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <TheButton
                    v-if="fromInput || toInput"
                    class="recipe-log-view__clear-button"
                    @click="clearFilters"
                >
                    Clear
                </TheButton>
            </div>

            <p v-if="filterError" class="recipe-log-view__field-error">{{ filterError }}</p>
        </div>

        <div class="recipe-log-view__results">
            <div v-if="loading" class="recipe-log-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div 
                    v-if="!filterError && logPage?.totalElements"
                    class="recipe-log-view__table__wrapper"
                >
                    <RecipeLogTable :logs="groupedEntries" />

                    <ThePager
                        v-if="(logPage?.totalElements ?? 0) > pageSize"
                        class="recipe-log-view__pager"
                        :current-page="page"
                        :total-pages="logPage?.totalPages"
                        @previous="onPrevious"
                        @next="onNext"
                    />
                </div>
            
                <div 
                    v-else 
                    class="recipe-log-view__empty"
                >
                    <p>No log entries found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import type { RecipeDetail } from '@/components/recipes/recipes-models'
import type { RecipeLogPage, RecipeLogPageEntry } from '@/components/recipes/log/recipe-log-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import ThePager from '@/components/base/ThePager.vue'
import RecipeLogTable from '@/components/recipes/log/RecipeLogTable.vue'
import TheButton from '@/components/base/TheButton.vue'

const pageSize = 10

const route = useRoute()

const recipe = ref<RecipeDetail | undefined>(undefined)
const logPage = ref<RecipeLogPage | undefined>(undefined)
const loading = ref(false)
const page = ref(1)
const fromInput = ref('')
const toInput = ref('')
const filterError = ref<string | null>(null)

const groupedEntries = computed(() => {
    const groups: { key: string, date: string, entries: RecipeLogPageEntry[] }[] = []
    const seen = new Map<string, RecipeLogPageEntry[]>()

    for (const entry of logPage.value?.entries ?? []) {
        const d = new Date(entry.createdAt)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (!seen.has(key)) {
            const bucket: RecipeLogPageEntry[] = []
            seen.set(key, bucket)
            groups.push({ key, date: formatDay(d), entries: bucket })
        }
        seen.get(key)!.push(entry)
    }

    return groups
})

async function fetchRecipe() {
    recipe.value = await new APICall<RecipeDetail>(`recipes/${route.params.id}`).execute()
}

async function fetchLog() {
    loading.value = true
    filterError.value = null

    try {
        const params = new URLSearchParams()
        params.set('page', String(page.value))
        params.set('pageSize', String(pageSize))
        if (fromInput.value) params.set('from', new Date(fromInput.value).toISOString())
        if (toInput.value) params.set('to', new Date(toInput.value).toISOString())

        logPage.value = await new APICall<RecipeLogPage>(`recipes/log/${route.params.id}?${params}`).execute()
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            filterError.value = e.getByField('from')[0]?.message ?? null
        }
    } finally {
        loading.value = false
    }
}

function onFilterChange() {
    page.value = 1
    fetchLog()
}

function clearFilters() {
    fromInput.value = ''
    toInput.value = ''
    filterError.value = null
    page.value = 1
    fetchLog()
}

function onPrevious() {
    page.value--
    fetchLog()
}

function onNext() {
    page.value++
    fetchLog()
}

function formatDay(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

onMounted(() => {
    fetchRecipe()
    fetchLog()
})
</script>

<style lang="scss">
    .recipe-log-view__filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .recipe-log-view__filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .recipe-log-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .recipe-log-view__datetime-input {
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

    .recipe-log-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .recipe-log-view__field-error {
        color: $fontColorError;
        font-size: 12px;
        margin: 0;
    }

    .recipe-log-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recipe-log-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
    }

    .recipe-log-view__table__wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    .recipe-log-view__empty {
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
