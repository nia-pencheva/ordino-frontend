<template>
    <TheLayout>
        <div v-if="loading" class="review-log-info__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else-if="entry">
            <TheTitle>{{ entry.recipeTitle }} - Returned for Revision</TheTitle>

            <div class="review-log-info__header-meta">
                <span class="review-log-info__header-time">{{ formatDateTime(entry.createdAt) }}</span>
                <span>{{ entry.userFullName }}</span>
            </div>

            <SectionTitle>Revision Notes</SectionTitle>
            <p v-if="entry.notes" class="review-log-info__notes">{{ entry.notes }}</p>
            <p v-else class="review-log-info__placeholder">No notes provided.</p>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { APICall } from '@/service/api/api'
import type { RecipeReviewReturnedForRevisionLogEntry } from '@/components/recipes/log/recipe-log-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import SectionTitle from '@/components/base/SectionTitle.vue'

const route = useRoute()

const loading = ref(true)
const entry = ref<RecipeReviewReturnedForRevisionLogEntry | undefined>(undefined)

function formatDateTime(ts: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(ts))
}

async function fetchEntry() {
    loading.value = true
    try {
        entry.value = await new APICall<RecipeReviewReturnedForRevisionLogEntry>(
            `recipes/log/review/returned-for-revision/${route.params.id}`
        ).execute()
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchEntry())
</script>

<style lang="scss">
    .review-log-info__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .review-log-info__header-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        color: #666;
        margin-bottom: 20px;
    }
</style>
