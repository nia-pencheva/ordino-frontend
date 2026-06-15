<template>
    <TheLayout>
        <div v-if="loading" class="review-submitted-log-info__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else-if="entry">
            <TheTitle>{{ displayTitle }} - Submitted for Approval</TheTitle>

            <div class="review-submitted-log-info__header-meta">
                <span>{{ formatDateTime(entry.createdAt) }}</span>
                <span>{{ entry.userFullName }}</span>
            </div>

            <div class="review-submitted-log-info__wrapper">
                <div class="review-submitted-log-info__body">
                    <div class="review-submitted-log-info__details">
                        <SectionTitle>Details</SectionTitle>

                        <div class="review-submitted-log-info__meta-row">
                            <span class="review-submitted-log-info__label">Categories</span>
                            <div v-if="snap.categories.length" class="review-submitted-log-info__tags">
                                <span
                                    v-for="c in snap.categories"
                                    :key="c.category"
                                    class="review-submitted-log-info__tag"
                                >{{ c.category }}</span>
                            </div>
                            <span v-else class="review-submitted-log-info__placeholder">No categories</span>
                        </div>

                        <div class="review-submitted-log-info__meta-row">
                            <span class="review-submitted-log-info__label">Prep time</span>
                            <span v-if="snap.preparationTime != null">{{ snap.preparationTime }} min</span>
                            <span v-else class="review-submitted-log-info__placeholder">Not specified</span>
                        </div>

                        <div class="review-submitted-log-info__meta-row">
                            <span class="review-submitted-log-info__label">Servings</span>
                            <span v-if="snap.servings != null">{{ snap.servings }}</span>
                            <span v-else class="review-submitted-log-info__placeholder">Not specified</span>
                        </div>

                        <SectionTitle>Description</SectionTitle>
                        <p v-if="snap.description" class="review-submitted-log-info__text">{{ snap.description }}</p>
                        <p v-else class="review-submitted-log-info__placeholder">No description</p>

                        <SectionTitle>Ingredients</SectionTitle>
                        <div v-if="sortedProducts.length" class="review-submitted-log-info__products">
                            <div
                                v-for="p in sortedProducts"
                                :key="p.productName"
                                class="review-submitted-log-info__product-row"
                            >
                                <span class="review-submitted-log-info__product-name">{{ p.productName }}</span>
                                <span class="review-submitted-log-info__product-qty">{{ p.quantity }} {{ p.unitAbbreviation }}</span>
                            </div>
                        </div>
                        <p v-else class="review-submitted-log-info__placeholder">No ingredients added.</p>
                    </div>

                    <div class="review-submitted-log-info__instructions">
                        <SectionTitle>Instructions</SectionTitle>
                        <ol v-if="parsedInstructions.length" class="review-submitted-log-info__steps">
                            <li
                                v-for="(step, i) in parsedInstructions"
                                :key="i"
                                class="review-submitted-log-info__step"
                            >{{ step.text }}</li>
                        </ol>
                        <p v-else class="review-submitted-log-info__placeholder">No instructions added.</p>
                    </div>
                </div>

                <div>
                    <SectionTitle>Notes</SectionTitle>
                    <p v-if="snap.notes" class="review-submitted-log-info__text">{{ snap.notes }}</p>
                    <p v-else class="review-submitted-log-info__placeholder">No notes</p>
                </div>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { APICall } from '@/service/api/api'
import type { RecipeReviewSubmittedForApprovalLogEntry } from '@/components/recipes/log/recipe-log-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import SectionTitle from '@/components/base/SectionTitle.vue'

interface SnapshotProduct {
    productName: string
    position: number
    quantity: number
    unitAbbreviation: string
}

interface SnapshotCategory {
    category: string
}

interface RecipeSnapshotData {
    title?: string | null
    preparationTime?: number | null
    servings?: number | null
    instructions?: string | null
    notes?: string | null
    description?: string | null
    products?: SnapshotProduct[]
    categories?: SnapshotCategory[]
}

const route = useRoute()

const loading = ref(true)
const entry = ref<RecipeReviewSubmittedForApprovalLogEntry | undefined>(undefined)

const snap = computed(() => {
    const empty = {
        title: null as string | null,
        preparationTime: null as number | null,
        servings: null as number | null,
        instructions: null as string | null,
        notes: null as string | null,
        description: null as string | null,
        products: [] as SnapshotProduct[],
        categories: [] as SnapshotCategory[],
    }
    if (!entry.value?.snapshot) return empty
    try {
        const p = JSON.parse(entry.value.snapshot) as RecipeSnapshotData
        return {
            title: p.title ?? null,
            preparationTime: p.preparationTime ?? null,
            servings: p.servings ?? null,
            instructions: p.instructions ?? null,
            notes: p.notes ?? null,
            description: p.description ?? null,
            products: p.products ?? [],
            categories: p.categories ?? [],
        }
    } catch { return empty }
})

const displayTitle = computed(() => snap.value.title ?? entry.value?.recipeTitle ?? 'Untitled')

const sortedProducts = computed(() =>
    [...snap.value.products].sort((a, b) => a.position - b.position)
)

const parsedInstructions = computed<{ text: string }[]>(() => {
    try { return JSON.parse(snap.value.instructions ?? '[]') }
    catch { return [] }
})

function formatDateTime(ts: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(ts))
}

async function fetchEntry() {
    loading.value = true
    try {
        entry.value = await new APICall<RecipeReviewSubmittedForApprovalLogEntry>(
            `recipes/log/review/submitted-for-approval/${route.params.id}`
        ).execute()
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchEntry())
</script>

<style lang="scss">
    .review-submitted-log-info__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .review-submitted-log-info__header-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        color: #666;
        margin-bottom: 20px;
    }

    .review-submitted-log-info__wrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .review-submitted-log-info__body {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 30px;
        align-items: flex-start;
    }

    .review-submitted-log-info__details {
        min-width: 0;
        width: 100%;

        @include desktop {
            width: 300px;
        }
    }

    .review-submitted-log-info__instructions {
        flex: 1;
        min-width: 0;
    }

    .review-submitted-log-info__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .review-submitted-log-info__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .review-submitted-log-info__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .review-submitted-log-info__tag {
        padding: 4px 10px;
        background: #e9f0fb;
        border: 1px solid #2d5aa0;
        border-radius: 3px;
        font-size: 12px;
        color: #2d5aa0;
    }

    .review-submitted-log-info__placeholder {
        color: #999;
        margin-bottom: 8px;
    }

    .review-submitted-log-info__text {
        margin-bottom: 8px;
        line-height: 1.5;
        white-space: pre-wrap;
    }

    .review-submitted-log-info__products {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .review-submitted-log-info__product-row {
        width: 200px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .review-submitted-log-info__product-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
    }

    .review-submitted-log-info__product-qty {
        flex-shrink: 0;
    }

    .review-submitted-log-info__steps {
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .review-submitted-log-info__step {
        line-height: 1.5;
    }
</style>
