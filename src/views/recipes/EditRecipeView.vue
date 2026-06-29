<template>
    <TheLayout>
        <div v-if="!loaded" class="edit-recipe-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <div class="edit-recipe-view__header">
                <TheTitle>{{ isNew ? 'New Draft' : 'Edit Recipe' }}</TheTitle>
                <TheButton 
                    class="edit-recipe-view__save-button" 
                    @click="handleSave"
                    :disabled="submitting"
                >
                    <span :class="{ 'edit-recipe-view__save-button-label--hidden': submitting }">Save</span>
                    <TheSpinner v-if="submitting" size="xs" class="edit-recipe-view__spinner" />
                </TheButton>
            </div>

            <div class="edit-recipe-view__container">
                <FormElement id="title" :errors="validationErrors?.getByField('title')">
                    <template #label>Title</template>
                    <TextInput id="title" type="text" v-model="title" placeholder="Recipe title" />
                </FormElement>

                <FormElement id="description" :errors="validationErrors?.getByField('description')">
                    <template #label>Description</template>
                    <TextArea 
                        v-model="description"
                        rows="5" 
                    />
                </FormElement>

                <div class="edit-recipe-view__meta-row">
                    <div class="recipe-form__recipe-category">
                        <FormElement id="recipe-category">
                            <template #label>Category</template>
                            <template #default="defaultProps">
                                <TheSelect
                                    :id="defaultProps.id"
                                    :options="categoryOptions"
                                    v-model="selectedNewCategoryId"
                                    placeholder="Add category..."
                                    :invalid="(validationErrors?.getByField('recipeCategories')?.length ?? 0) > 0"
                                />
                            </template>
                        </FormElement>
                        
                        <div v-if="selectedCategoryIds.length" class="edit-recipe-view__tags">
                            <span
                                v-for="id in selectedCategoryIds"
                                :key="id"
                                class="edit-recipe-view__tag"
                            >
                                {{ categoryLabel(id) }}
                                <span class="edit-recipe-view__tag-remove" @click="removeCategory(id)">×</span>
                            </span>
                        </div>
                    </div>

                    <div class="recipe-form__prep-time-and-servings__wrapper">
                         <FormElement 
                            id="prep-time" 
                            class="recipe-form__prep-time" 
                            :errors="validationErrors?.getByField('preparationTime')"
                        >
                            <template #label>Prep time (min)</template>
                            <NumberInput id="prep-time" v-model="preparationTime" :min="1" :max="4320" placeholder="Minutes" />
                        </FormElement>

                        <FormElement 
                            id="servings" 
                            :errors="validationErrors?.getByField('servings')"
                            class="recipe-form__servings"    
                        >
                            <template #label>Servings</template>
                            <NumberInput id="servings" v-model="servings" :min="1" :max="255" placeholder="Servings" />
                        </FormElement>
                    </div>
                </div>

                <div class="edit-recipe-view__panels">
                    <div class="edit-recipe-view__products-panel">
                        <div class="edit-recipe-view__panel-title">Ingredients</div>

                        <TheSelect
                            :options="productOptions"
                            v-model="selectedNewProductId"
                            placeholder="Add ingredient..."
                            class="edit-recipe-view__add-select"
                            leaf-only
                        />

                        <div class="edit-recipe-view__products-list">
                            <p v-for="error in (validationErrors?.getByField('recipeProducts') ?? [])" class="edit-recipe-view__step-error">{{ error.message }}</p>
                            <div
                                v-for="(product, idx) in editProducts"
                                :key="`${product.productId}-${idx}`"
                                class="edit-recipe-view__product-row"
                            >
                                <div class="edit-recipe-view__arrows">
                                    <span class="edit-recipe-view__arrow" @click="moveProduct(idx, -1)">▲</span>
                                    <span class="edit-recipe-view__arrow" @click="moveProduct(idx, 1)">▼</span>
                                </div>
                                <span class="edit-recipe-view__product-name">{{ product.name }}</span>
                                <NumberInput
                                    v-model="product.quantity"
                                    :min="0"
                                    class="edit-recipe-view__qty-input"
                                    placeholder="Qty"
                                    :invalid="productHasError(idx, 'quantity')"
                                />
                                <TheSelect
                                    :options="unitOptions"
                                    v-model="product.unitId"
                                    placeholder="Unit"
                                    class="edit-recipe-view__unit-select"
                                    leaf-only
                                    :invalid="productHasError(idx, 'unitId')"
                                />
                                <span class="edit-recipe-view__remove-button" @click="removeProduct(idx)">×</span>
                            </div>
                        </div>
                    </div>

                    <div class="edit-recipe-view__instructions-panel">
                        <div class="edit-recipe-view__panel-header">
                            <div class="edit-recipe-view__panel-title">Instructions</div>
                            <TheButton class="edit-recipe-view__add-step-button" @click="addInstruction">
                                Add Step
                            </TheButton>
                        </div>
                        <ul v-if="validationErrors?.getByField('instructions')?.length" class="edit-recipe-view__instructions-error">
                            <li v-for="error in validationErrors?.getByField('instructions')">{{ error.message }}</li>
                        </ul>

                        <div class="edit-recipe-view__steps-list">
                            <div
                                v-for="(step, idx) in editInstructions"
                                :key="idx"
                                class="edit-recipe-view__step-row"
                            >
                                <div class="edit-recipe-view__arrows">
                                    <span class="edit-recipe-view__arrow" @click="moveInstruction(idx, -1)">▲</span>
                                    <span class="edit-recipe-view__arrow" @click="moveInstruction(idx, 1)">▼</span>
                                </div>
                                <span class="edit-recipe-view__step-number">{{ idx + 1 }}.</span>
                                <div class="edit-recipe-view__step-textarea-wrapper">
                                    <TextArea v-model="step.text" class="edit-recipe-view__step-textarea" />
                                    <p v-for="error in stepErrors(idx)" class="edit-recipe-view__step-error">{{ error.message }}</p>
                                </div>
                                <span class="edit-recipe-view__remove-button" @click="removeInstruction(idx)">×</span>
                            </div>
                        </div>
                    </div>
                </div>

                <FormElement 
                    id="notes" 
                    :errors="validationErrors?.getByField('notes')"
                >
                    <template #label>Notes (optional)</template>
                    <TextArea 
                        v-model="notes" 
                        rows="5"
                    />
                </FormElement>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import type { ValidationError } from '@/service/api/models/response-errors'
import type { SelectOption } from '@/components/base/TheSelect.vue'
import type { RecipeForEditingResponse, RecipeEditData, EditRecipeProduct, Instruction } from '@/components/recipes/recipes-models'
import type { RecipeCategoriesPage } from '@/components/recipes/categories/recipe-categories-models'

import router from '@/router/index'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheButton from '@/components/base/TheButton.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import TheSelect from '@/components/base/TheSelect.vue'
import TextInput from '@/components/base/TextInput.vue'
import TextArea from '@/components/base/TextArea.vue'
import NumberInput from '@/components/base/NumberInput.vue'
import FormElement from '@/components/base/form/FormElement.vue'

const route = useRoute()

const isNew = computed(() => route.params.id === 'new')

const editingResponse = ref<RecipeForEditingResponse | undefined>(undefined)
const editData = ref<RecipeEditData | undefined>(undefined)
const loaded = ref(false)
const allCategories = ref<{ id: number; category: string }[]>([])

const submitting = ref<boolean>(false);
const title = ref<string>('')
const preparationTime = ref<number | null>(null)
const servings = ref<number | null>(null)
const description = ref<string>('')
const notes = ref<string>('')
const selectedCategoryIds = ref<number[]>([])
const selectedNewCategoryId = ref<number | string | null>(null)
const selectedNewProductId = ref<number | string | null>(null)
const editProducts = ref<EditRecipeProduct[]>([])
const editInstructions = ref<Instruction[]>([])
const validationErrors = ref<UnprocessableContentError | undefined>(undefined)

const recipe = computed(() => editingResponse.value?.recipe)
const activeEditData = computed<RecipeEditData | undefined>(() => editingResponse.value ?? editData.value)

const categoryOptions = computed<SelectOption[]>(() =>
    allCategories.value
        .filter(c => !selectedCategoryIds.value.includes(c.id))
        .map(c => ({ value: c.id, label: c.category }))
)

const productOptions = computed<SelectOption[]>(() => {
    if (!activeEditData.value) return []
    const selected = new Set(editProducts.value.map(p => p.productId))
    return buildProductOptions(activeEditData.value.productCategories, selected)
})

const unitOptions = computed<SelectOption[]>(() => {
    if (!activeEditData.value) return []
    return activeEditData.value.unitCategories.map(uc => ({
        value: `ucat_${uc.id}`,
        label: uc.category,
        children: uc.units.map(u => ({ value: u.id, label: u.abbreviation })),
    }))
})

function buildProductOptions(categories: RecipeForEditingResponse['productCategories'], selected: Set<number>): SelectOption[] {
    return categories.flatMap(cat => {
        const children = [
            ...cat.products.map(p => ({ value: p.id, label: p.name, disabled: selected.has(p.id) })),
            ...buildProductOptions(cat.subCategories, selected),
        ]
        if (!children.length) return []
        return [{ value: `cat_${cat.id}`, label: cat.category, children }]
    })
}

function categoryLabel(id: number): string {
    return allCategories.value.find(c => c.id === id)?.category ?? String(id)
}

function removeCategory(id: number) {
    selectedCategoryIds.value = selectedCategoryIds.value.filter(c => c !== id)
}

function findProductName(id: number): string {
    if (!activeEditData.value) return ''
    return searchProductName(activeEditData.value.productCategories, id)
}

function searchProductName(
    categories: RecipeForEditingResponse['productCategories'],
    id: number
): string {
    for (const cat of categories) {
        const p = cat.products.find(p => p.id === id)
        if (p) return p.name
        const found = searchProductName(cat.subCategories, id)
        if (found) return found
    }
    return ''
}

function moveProduct(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= editProducts.value.length) return
    const arr = [...editProducts.value]
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    editProducts.value = arr
}

function removeProduct(idx: number) {
    editProducts.value = editProducts.value.filter((_, i) => i !== idx)
}

function addInstruction() {
    editInstructions.value = [...editInstructions.value, { text: '' }]
}

function moveInstruction(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= editInstructions.value.length) return
    const arr = [...editInstructions.value]
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    editInstructions.value = arr
}

function removeInstruction(idx: number) {
    editInstructions.value = editInstructions.value.filter((_, i) => i !== idx)
}

function productHasError(idx: number, field: string): boolean {
    return (validationErrors.value?.getByField(`recipeProducts[${idx}].${field}`).length ?? 0) > 0
}

function stepErrors(idx: number): ValidationError[] {
    return validationErrors.value?.getByField(`instructions[${idx}].text`) ?? []
}

watch(selectedNewCategoryId, (val) => {
    if (typeof val === 'number' && !selectedCategoryIds.value.includes(val)) {
        selectedCategoryIds.value = [...selectedCategoryIds.value, val]
    }
    selectedNewCategoryId.value = null
})

watch(selectedNewProductId, (val) => {
    if (typeof val === 'number') {
        editProducts.value = [
            ...editProducts.value,
            {
                productId: val,
                position: editProducts.value.length + 1,
                quantity: null,
                unitId: null,
                name: findProductName(val),
            },
        ]
    }
    selectedNewProductId.value = null
})

async function handleSave() {
    submitting.value = true;
    validationErrors.value = undefined

    const body = {
        title: title.value || null,
        preparationTime: preparationTime.value || null,
        servings: servings.value || null,
        instructions: editInstructions.value.length > 0 ? JSON.stringify(editInstructions.value) : null,
        notes: notes.value || null,
        description: description.value || null,
        recipeProducts: editProducts.value.map((p, i) => ({
            productId: p.productId,
            position: i + 1,
            quantity: p.quantity,
            unitId: p.unitId,
        })),
        recipeCategories: selectedCategoryIds.value.map(id => ({ recipeCategoryId: id })),
    }

    try {
        if (isNew.value) {
            const draftId = await new APICall<number>('recipes/draft', 'POST', body as Record<string, unknown>).execute()
            router.replace(`/recipes/${draftId}/edit`)
        } else {
            if (!recipe.value) return
            const isDraft = recipe.value.status === 'DRAFT' || recipe.value.status === 'RETURNED_FOR_REVISION'
            const path = isDraft ? `recipes/draft/${recipe.value.id}` : `recipes/${recipe.value.id}`
            await new APICall(path, 'POST', body as Record<string, unknown>).execute()
        }
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            validationErrors.value = e
        }
        else throw e;
    } finally {
        submitting.value = false;
    }
}

onMounted(async () => {
    if (isNew.value) {
        const [data, catPage] = await Promise.all([
            new APICall<RecipeEditData>('recipes/edit-data').execute(),
            new APICall<RecipeCategoriesPage>('recipe-categories?page=1&pageSize=100').execute(),
        ])
        editData.value = data
        allCategories.value = catPage.recipeCategories
    } else {
        const [editing, catPage] = await Promise.all([
            new APICall<RecipeForEditingResponse>(`recipes/${route.params.id}/edit`).execute(),
            new APICall<RecipeCategoriesPage>('recipe-categories?page=1&pageSize=100').execute(),
        ])

        editingResponse.value = editing
        allCategories.value = catPage.recipeCategories

        const r = editing.recipe
        title.value = r.title ?? ''
        preparationTime.value = r.preparationTime
        servings.value = r.servings
        description.value = r.description ?? ''
        notes.value = r.notes ?? ''
        selectedCategoryIds.value = r.recipeCategories.map(c => c.id)

        editProducts.value = r.products.map(p => ({
            productId: p.id,
            position: p.position,
            quantity: Number(p.quantity),
            unitId: p.unit.id,
            name: p.name,
        }))

        editInstructions.value = r.instructions
            ? (() => { try { return JSON.parse(r.instructions!) } catch { return [] } })()
            : []
    }

    loaded.value = true
})
</script>

<style lang="scss">
    .edit-recipe-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .edit-recipe-view__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .edit-recipe-view__save-button {
        padding: 4px 20px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
    }

    .edit-recipe-view__save-button-label--hidden {
        visibility: hidden;
    }

    .edit-recipe-view__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .edit-recipe-view__container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 1400px;
        width: 100%;
    }

    .edit-recipe-view__meta-row {
        display: flex;
        flex-direction: row;
        gap: 15px;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .recipe-form__recipe-category {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 100px;
    }

    #recipe-category {
        max-width: 100px;
    }

    .edit-recipe-view__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        max-width: 300px;
    }

    .edit-recipe-view__tag {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: #e9f0fb;
        border: 1px solid #2d5aa0;
        border-radius: 3px;
        white-space: nowrap;
        font-size: 12px;
        color: #2d5aa0;
    }

    .edit-recipe-view__tag-remove {
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        color: #2d5aa0;

        &:hover {
            color: #c0392b;
        }
    }

    .recipe-form__prep-time-and-servings__wrapper {
        display: flex;
        flex-direction: row;
        gap: 15px;
    }

    .recipe-form__prep-time,
    .recipe-form__servings {
        width: 100px;
    }

    .edit-recipe-view__panels {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
        align-items: flex-start;
        border-top: 1px solid $midGray;
        border-bottom: 1px solid $midGray;
        padding: 15px 0px;
    }

    .edit-recipe-view__products-panel {
        width: 100%;
        max-height: 500px;
        align-self: stretch;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid $midGray;
        gap: 10px;

        @include desktop {
            width: 300px;
            border-bottom: none;
            border-right: 1px solid $midGray;
            padding-right: 10px;
        }
    }

    .edit-recipe-view__instructions-panel {
        align-self: stretch;
        flex: 1;
        min-width: 0;
        max-height: 500px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .edit-recipe-view__instructions-error {
        color: $fontColorError;
        font-size: 12px;
    }

    .edit-recipe-view__panel-title {
        font-weight: 600;
        font-size: 14px;
    }

    .edit-recipe-view__panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .edit-recipe-view__add-step-button {
        padding: 4px 10px;
        font-size: 14px;
    }

    .edit-recipe-view__add-select {
        width: 100%;
    }

    .edit-recipe-view__products-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        height: 100%;
        padding-right: 2px;
    }

    .edit-recipe-view__product-row {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
    }

    .edit-recipe-view__steps-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 500px;
        overflow-y: auto;
        padding-right: 2px;
    }

    .edit-recipe-view__step-row {
        display: flex;
        align-items: flex-start;
        gap: 5px;
    }

    .edit-recipe-view__arrows {
        display: flex;
        flex-direction: column;
        gap: 1px;
        flex-shrink: 0;
    }

    .edit-recipe-view__arrow {
        font-size: 10px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.4);
        line-height: 1.2;
        user-select: none;

        &:hover {
            color: rgba(0, 0, 0, 0.75);
        }
    }

    .edit-recipe-view__product-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
    }

    .edit-recipe-view__qty-input {
        max-width: 65px;
        flex-shrink: 0;
    }

    .edit-recipe-view__unit-select {
        flex-shrink: 0;
        min-width: unset;
        
        .the-select__trigger {
            width: 60px;
        }

        .the-select__dropdown {
            width: 110px;
        }
    }

    .edit-recipe-view__step-number {
        flex-shrink: 0;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.5);
        padding-top: 4px;
        min-width: 20px;
    }

    .edit-recipe-view__step-textarea-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .edit-recipe-view__step-textarea {
        width: 100%;
        min-height: 60px;
        resize: vertical;
    }

    .edit-recipe-view__step-error {
        color: $fontColorError;
        font-size: 12px;
    }

    .edit-recipe-view__remove-button {
        flex-shrink: 0;
        cursor: pointer;
        font-weight: bold;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.3);
        user-select: none;

        &:hover {
            color: #c0392b;
        }
    }
</style>
