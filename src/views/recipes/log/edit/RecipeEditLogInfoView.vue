<template>
    <TheLayout>
        <div v-if="loading" class="edit-log-info__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else-if="entry">
            <TheTitle>
                <template v-if="hasChanged('title')">
                    <p class="edit-log-info__title--changed">
                        <span 
                            class="edit-log-info__scalar--removed"
                        >
                            {{ oldSnap.title ?? '-' }}
                        </span>
                        <span class="edit-log-info__scalar--added">
                            {{ newSnap.title ?? '-' }}
                        </span>
                    </p>
                </template>
                <template v-else>{{ displayTitle }} - Edited</template>
            </TheTitle>

            <div class="edit-log-info__header-meta">
                <span class="edit-log-info__header-time">{{ formatDateTime(entry.createdAt) }}</span>
                <TheLink @click="router.push({ name: 'user-info', params: { id: entry.userId } })">
                    {{ entry.userFullName }}
                </TheLink>
            </div>

            <div class="edit-log-info__wrapper">
                <div class="edit-log-info__body">
                    <div class="edit-log-info__details">
                        <SectionTitle>Details</SectionTitle>

                        <div class="edit-log-info__meta-row">
                            <span class="edit-log-info__label">Categories</span>
                            <template v-if="!hasChanged('categories')">
                                <div v-if="newSnap.categories.length" class="edit-log-info__tags">
                                    <span
                                        v-for="c in newSnap.categories"
                                        :key="c.category"
                                        class="edit-log-info__tag"
                                    >{{ c.category }}</span>
                                </div>
                                <span v-else class="edit-log-info__placeholder">No categories</span>
                            </template>
                            <div v-else class="edit-log-info__tags">
                                <template v-if="categoryDiff.length">
                                    <span
                                        v-for="(item, i) in categoryDiff"
                                        :key="i"
                                        :class="['edit-log-info__tag', item.op !== 'equal' ? `edit-log-info__tag--${item.op}` : '']"
                                    >{{ item.category }}</span>
                                </template>
                                <span v-else class="edit-log-info__placeholder">No categories</span>
                            </div>
                        </div>

                        <div class="edit-log-info__meta-row">
                            <span class="edit-log-info__label">Prep time</span>
                            <template v-if="!hasChanged('preparationTime')">
                                <span v-if="newSnap.preparationTime != null">{{ newSnap.preparationTime }} min</span>
                                <span v-else class="edit-log-info__placeholder">Not specified</span>
                            </template>
                            <template v-else>
                                <span class="edit-log-info__scalar--removed">{{ oldSnap.preparationTime ?? '-' }}</span>
                                <span class="edit-log-info__scalar--added">{{ newSnap.preparationTime ?? '-' }}</span>
                                <span class="edit-log-info__scalar-unit">min</span>
                            </template>
                        </div>

                        <div class="edit-log-info__meta-row">
                            <span class="edit-log-info__label">Servings</span>
                            <template v-if="!hasChanged('servings')">
                                <span v-if="newSnap.servings != null">{{ newSnap.servings }}</span>
                                <span v-else class="edit-log-info__placeholder">Not specified</span>
                            </template>
                            <template v-else>
                                <span class="edit-log-info__scalar--removed">{{ oldSnap.servings ?? '-' }}</span>
                                <span class="edit-log-info__scalar--added">{{ newSnap.servings ?? '-' }}</span>
                            </template>
                        </div>

                        <SectionTitle>Description</SectionTitle>
                        <template v-if="!hasChanged('description')">
                            <p v-if="newSnap.description" class="edit-log-info__text">{{ newSnap.description }}</p>
                            <p v-else class="edit-log-info__placeholder">No description</p>
                        </template>
                        <div v-else class="edit-log-info__diff-block">
                            <div
                                v-for="(line, i) in descriptionDiff"
                                :key="i"
                                :class="['edit-log-info__diff-line', line.op !== 'equal' ? `edit-log-info__diff-line--${line.op}` : '']"
                            ><span class="edit-log-info__diff-prefix">{{ diffPrefix(line.op) }}</span><span class="edit-log-info__diff-text">{{ line.text }}</span></div>
                        </div>

                        <SectionTitle>Ingredients</SectionTitle>
                        <template v-if="!hasChanged('products')">
                            <div v-if="sortedNewProducts.length" class="edit-log-info__products">
                                <div
                                    v-for="p in sortedNewProducts"
                                    :key="p.productName"
                                    class="edit-log-info__product-row"
                                >
                                    <span class="edit-log-info__product-name">{{ p.productName }}</span>
                                    <span class="edit-log-info__product-qty">{{ p.quantity }} {{ p.unitAbbreviation }}</span>
                                </div>
                            </div>
                            <p v-else class="edit-log-info__placeholder">No ingredients added.</p>
                        </template>
                        <div v-else class="edit-log-info__products edit-log-info__products--diff">
                            <template v-if="productDiff.length">
                                <div
                                    v-for="(item, i) in productDiff"
                                    :key="i"
                                    :class="['edit-log-info__product-row', productRowClass(item)]"
                                >
                                    <span v-if="item.op === 'delete' || item.op === 'insert'" class="edit-log-info__diff-prefix edit-log-info__diff-prefix--product">{{ productDiffPrefix(item) }}</span>
                                    <span class="edit-log-info__product-name">{{ item.productName }}</span>
                                    <span class="edit-log-info__product-qty">
                                        <template v-if="item.op === 'modify'">
                                            <template v-if="item.quantityChanged">
                                                <span class="edit-log-info__inline--removed">{{ item.oldQuantity }}</span>
                                                <span class="edit-log-info__inline--added">{{ item.newQuantity }}</span>
                                            </template>
                                            <template v-else>{{ item.newQuantity }}</template>
                                            &nbsp;
                                            <template v-if="item.unitChanged">
                                                <span class="edit-log-info__inline--removed">{{ item.oldUnit }}</span>
                                                <span class="edit-log-info__inline--added">{{ item.newUnit }}</span>
                                            </template>
                                            <template v-else>{{ item.newUnit }}</template>
                                        </template>
                                        <template v-else>
                                            {{ item.quantity }} {{ item.unitAbbreviation }}
                                        </template>
                                    </span>
                                </div>
                            </template>
                            <p v-else class="edit-log-info__placeholder">No ingredients added.</p>
                        </div>
                    </div>

                    <div class="edit-log-info__instructions">
                        <SectionTitle>Instructions</SectionTitle>
                        <template v-if="!hasChanged('instructions')">
                            <ol v-if="parsedNewInstructions.length" class="edit-log-info__steps">
                                <li
                                    v-for="(step, i) in parsedNewInstructions"
                                    :key="i"
                                    class="edit-log-info__step"
                                >{{ step.text }}</li>
                            </ol>
                            <p v-else class="edit-log-info__placeholder">No instructions added.</p>
                        </template>
                        <div v-else class="edit-log-info__diff-block">
                            <template v-if="instructionsDiff.length">
                                <div
                                    v-for="(line, i) in instructionsDiff"
                                    :key="i"
                                    :class="['edit-log-info__diff-line', line.op !== 'equal' ? `edit-log-info__diff-line--${line.op}` : '']"
                                ><span class="edit-log-info__diff-prefix">{{ diffPrefix(line.op) }}</span><span class="edit-log-info__diff-text">{{ line.text }}</span></div>
                            </template>
                            <p v-else class="edit-log-info__placeholder">No instructions added.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <SectionTitle>Notes</SectionTitle>
                    <template v-if="!hasChanged('notes')">
                        <p v-if="newSnap.notes" class="edit-log-info__text">{{ newSnap.notes }}</p>
                        <p v-else class="edit-log-info__placeholder">No notes</p>
                    </template>
                    <div v-else class="edit-log-info__diff-block">
                        <div
                            v-for="(line, i) in notesDiff"
                            :key="i"
                            :class="['edit-log-info__diff-line', line.op !== 'equal' ? `edit-log-info__diff-line--${line.op}` : '']"
                        ><span class="edit-log-info__diff-prefix">{{ diffPrefix(line.op) }}</span><span class="edit-log-info__diff-text">{{ line.text }}</span></div>
                    </div>
                </div>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { APICall } from '@/service/api/api'
import type { RecipeEditLogEntry } from '@/components/recipes/log/recipe-log-models'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import SectionTitle from '@/components/base/SectionTitle.vue'
import TheLink from '@/components/base/TheLink.vue'
import router from '@/router'

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

type DiffOp = 'equal' | 'delete' | 'insert'

interface DiffLine {
    op: DiffOp
    text: string
}

interface CategoryDiffItem {
    category: string
    op: DiffOp
}

type ProductDiffItem =
    | { op: 'equal' | 'delete' | 'insert'; productName: string; quantity: number; unitAbbreviation: string }
    | { op: 'modify'; productName: string; oldQuantity: number; newQuantity: number; oldUnit: string; newUnit: string; quantityChanged: boolean; unitChanged: boolean }

const route = useRoute()

const loading = ref(true)
const entry = ref<RecipeEditLogEntry | undefined>(undefined)

const oldSnap = computed<RecipeSnapshotData>(() => {
    if (!entry.value?.oldData) return {}
    try { return JSON.parse(entry.value.oldData) as RecipeSnapshotData }
    catch { return {} }
})

const newSnap = computed(() => {
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
    if (!entry.value?.newData) return empty
    try {
        const p = JSON.parse(entry.value.newData) as RecipeSnapshotData
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

const displayTitle = computed(() => newSnap.value.title ?? entry.value?.recipeTitle ?? 'Untitled')

const sortedNewProducts = computed(() =>
    [...newSnap.value.products].sort((a, b) => a.position - b.position)
)

const parsedNewInstructions = computed<{ text: string }[]>(() => {
    try { return JSON.parse(newSnap.value.instructions ?? '[]') }
    catch { return [] }
})

const categoryDiff = computed<CategoryDiffItem[]>(() => {
    const oldCats = (oldSnap.value.categories ?? []).map(c => c.category)
    const newCats = newSnap.value.categories.map(c => c.category)
    return lcsArrayDiff(oldCats, newCats, x => x).map(r => ({
        category: r.op === 'delete' ? r.aItem! : r.bItem!,
        op: r.op,
    }))
})

const descriptionDiff = computed<DiffLine[]>(() =>
    diffText(oldSnap.value.description, newSnap.value.description)
)

const notesDiff = computed<DiffLine[]>(() =>
    diffText(oldSnap.value.notes, newSnap.value.notes)
)

const instructionsDiff = computed<DiffLine[]>(() => {
    const parseSteps = (json: string | null | undefined): { text: string }[] => {
        try { return JSON.parse(json ?? '[]') }
        catch { return [] }
    }
    const oldSteps = parseSteps(oldSnap.value.instructions)
    const newSteps = parseSteps(newSnap.value.instructions)
    return lcsArrayDiff(oldSteps, newSteps, s => s.text).map(r => ({
        op: r.op,
        text: r.op === 'delete' ? r.aItem!.text : r.bItem!.text,
    }))
})

const productDiff = computed<ProductDiffItem[]>(() => {
    const oldProds = [...(oldSnap.value.products ?? [])].sort((a, b) => a.position - b.position)
    const newProds = [...newSnap.value.products].sort((a, b) => a.position - b.position)
    return lcsArrayDiff(oldProds, newProds, p => p.productName).map(r => {
        if (r.op === 'equal') {
            const o = r.aItem!
            const n = r.bItem!
            const qChanged = o.quantity !== n.quantity
            const uChanged = o.unitAbbreviation !== n.unitAbbreviation
            if (qChanged || uChanged) {
                return { op: 'modify' as const, productName: n.productName, oldQuantity: o.quantity, newQuantity: n.quantity, oldUnit: o.unitAbbreviation, newUnit: n.unitAbbreviation, quantityChanged: qChanged, unitChanged: uChanged }
            }
            return { op: 'equal' as const, productName: n.productName, quantity: n.quantity, unitAbbreviation: n.unitAbbreviation }
        }
        if (r.op === 'delete') {
            return { op: 'delete' as const, productName: r.aItem!.productName, quantity: r.aItem!.quantity, unitAbbreviation: r.aItem!.unitAbbreviation }
        }
        return { op: 'insert' as const, productName: r.bItem!.productName, quantity: r.bItem!.quantity, unitAbbreviation: r.bItem!.unitAbbreviation }
    })
})

function hasChanged(field: keyof RecipeSnapshotData): boolean {
    return field in oldSnap.value
}

function lcsArrayDiff<T>(a: T[], b: T[], key: (x: T) => string): { op: DiffOp; aItem?: T; bItem?: T }[] {
    const m = a.length, n = b.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = key(a[i - 1]) === key(b[j - 1])
                ? dp[i - 1][j - 1] + 1
                : Math.max(dp[i - 1][j], dp[i][j - 1])
        }
    }
    const result: { op: DiffOp; aItem?: T; bItem?: T }[] = []
    let i = m, j = n
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && key(a[i - 1]) === key(b[j - 1])) {
            result.unshift({ op: 'equal', aItem: a[i - 1], bItem: b[j - 1] })
            i--; j--
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.unshift({ op: 'insert', bItem: b[j - 1] })
            j--
        } else {
            result.unshift({ op: 'delete', aItem: a[i - 1] })
            i--
        }
    }
    return result
}

function diffText(oldText: string | null | undefined, newText: string | null | undefined): DiffLine[] {
    const a = oldText ? oldText.split('\n') : []
    const b = newText ? newText.split('\n') : []
    return lcsArrayDiff(a, b, x => x).map(r => ({
        op: r.op,
        text: (r.op === 'delete' ? r.aItem : r.bItem) ?? '',
    }))
}

function diffPrefix(op: DiffOp): string {
    return op === 'delete' ? '-' : op === 'insert' ? '+' : ' '
}

function productRowClass(item: ProductDiffItem): string {
    if (item.op === 'delete') return 'edit-log-info__product-row--removed'
    if (item.op === 'insert') return 'edit-log-info__product-row--added'
    return ''
}

function productDiffPrefix(item: ProductDiffItem): string {
    if (item.op === 'delete') return '-'
    if (item.op === 'insert') return '+'
    return ' '
}

function formatDateTime(ts: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(ts))
}

async function fetchEntry() {
    loading.value = true
    try {
        entry.value = await new APICall<RecipeEditLogEntry>(`recipes/log/edit/${route.params.id}`).execute()
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchEntry())
</script>

<style lang="scss">
    .edit-log-info__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .edit-log-info__title--changed {
        display: flex;
        flex-direction: column;
        gap: 5px;

        span {
            font-weight: bold;
        }
    }

    .edit-log-info__header-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        color: #666;
        margin-bottom: 20px;
    }

    .edit-log-info__wrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .edit-log-info__body {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 30px;
        align-items: flex-start;
    }

    .edit-log-info__details {
        min-width: 0;
        width: 100%;

        @include desktop {
            width: 300px;
        }
    }

    .edit-log-info__instructions {
        flex: 1;
        min-width: 0;
    }

    .edit-log-info__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 25px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .edit-log-info__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .edit-log-info__placeholder {
        color: #999;
    }

    .edit-log-info__text {
        margin-bottom: 8px;
        line-height: 1.5;
        white-space: pre-wrap;
    }

    .edit-log-info__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .edit-log-info__tag {
        padding: 4px 10px;
        background: #e9f0fb;
        border: 1px solid #2d5aa0;
        border-radius: 3px;
        color: #2d5aa0;

        &--delete {
            background: #ffd7d5;
            color: #82071e;
            border-color: #82071e;
        }

        &--insert {
            background: #d4edda;
            color: #256236;
            border-color: #256236;
        }
    }

    .edit-log-info__scalar--removed {
        padding: 2px 7px;
        border-radius: 3px;
        background: #ffd7d5;
        color: #82071e;
        font-weight: 500;
    }

    .edit-log-info__scalar--added {
        padding: 2px 7px;
        border-radius: 3px;
        background: #d4edda;
        color: #256236;
        font-weight: 500;
    }

    .edit-log-info__scalar-unit {
        color: #444;
    }

    .edit-log-info__diff-line {
        display: flex;
        align-items: baseline;
        padding: 1px 8px;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;

        &--delete {
            background: #ffeef0;

            .edit-log-info__diff-prefix { color: #b31d28; }
        }

        &--insert {
            background: #e6ffed;

            .edit-log-info__diff-prefix { color: #22863a; }
        }
    }

    .edit-log-info__diff-prefix {
        flex-shrink: 0;
        width: 14px;
        user-select: none;
        color: #aaa;
    }

    .edit-log-info__diff-text {
        flex: 1;
    }

    .edit-log-info__products {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .edit-log-info__product-row {
        width: 200px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 8px;

        &--removed {
            background: #ffeef0;

            .edit-log-info__diff-prefix--product { color: #b31d28; }
        }

        &--added {
            background: #e6ffed;

            .edit-log-info__diff-prefix--product { color: #22863a; }
        }
    }

    .edit-log-info__diff-prefix--product {
        flex-shrink: 0;
        width: 14px;
        color: #aaa;
        user-select: none;
    }

    .edit-log-info__product-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
    }

    .edit-log-info__product-qty {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 3px;
    }

    .edit-log-info__inline--removed {
        padding: 1px 4px;
        border-radius: 2px;
        background: #ffd7d5;
        color: #82071e;
    }

    .edit-log-info__inline--added {
        padding: 1px 4px;
        border-radius: 3px;
        background: #d4edda;
        color: #256236;
    }

    .edit-log-info__steps {
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .edit-log-info__step {
        line-height: 1.5;
    }
</style>
