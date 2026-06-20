<template>
    <TheLayout>
        <div v-if="!recipe" class="recipe-info-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>
                <div class="recipe-info-view__title-and-history-button__wrapper">
                    <span>{{ recipe.title ?? 'Untitled' }}</span>
                    <TheButton
                        v-if="showHistory"
                        class="recipe-info-view__button--history"
                        @click="router.push({ name: 'recipe-log', params: { id: recipe.id } })"
                    >
                        History
                    </TheButton>
                </div>
                <ul 
                    v-if="validationErrors?.getByField('title')?.length" 
                    class="recipe-info-view__field-errors"
                    style="margin: 8px 0px 0px; font-size: 14px;"    
                >
                    <li v-for="error in validationErrors?.getByField('title')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                </ul>
            </TheTitle>

            <div class="recipe-info-view__toolbar">
                <TheButton
                    v-if="showEdit"
                    class="recipe-info-view__button"
                    @click="router.push(`/recipes/${recipe.id}/edit`)"
                >
                    Edit
                </TheButton>

                <TheButton
                    v-if="showReturn"
                    class="recipe-info-view__button"
                    @click="returnPopupOpen = true"
                >
                    Return
                </TheButton>

                <TheButton
                    v-if="showApprove"
                    class="recipe-info-view__button"
                    @click="approvePopupOpen = true"
                >
                    Approve
                </TheButton>

                <TheButton
                    v-if="showDiscard"
                    class="recipe-info-view__button"
                    type="important"
                    @click="discardPopupOpen = true"
                >
                    Discard
                </TheButton>

                <TheButton
                    v-if="showSelfApprove"
                    class="recipe-info-view__button"
                    @click="selfApprovePopupOpen = true"
                >
                    Approve
                </TheButton>

                <TheButton
                    v-if="showSubmit"
                    class="recipe-info-view__button"
                    @click="submitPopupOpen = true"
                >
                    Submit
                </TheButton>

                <TheButton
                    v-if="showArchive"
                    class="recipe-info-view__button"
                    type="important"
                    @click="archivePopupOpen = true"
                >
                    Archive
                </TheButton>

                <TheButton
                    v-if="showReturnToApproved"
                    class="recipe-info-view__button"
                    style="width: 150px;"
                    type="important"
                    @click="returnToApprovedPopup = true"
                >
                    Return to approved
                </TheButton>

                <TheButton
                    v-if="showDelete"
                    class="recipe-info-view__button"
                    type="important"
                    @click="deletePopupOpen = true"
                >
                    Delete
                </TheButton>
            </div>

            <div class="recipe-info-view__wrapper">
                <div class="recipe-info-view__body">
                    <div class="recipe-info-view__details">
                        <SectionTitle>Details</SectionTitle>

                        <div class="recipe-info-view__meta-row">
                            <span class="recipe-info-view__label">Status</span>
                            <span :class="['recipe-info-view__status', `recipe-info-view__status--${recipe.status.toLowerCase()}`]">
                                {{ statusLabel }}
                            </span>
                        </div>

                        <div class="recipe-info-view__meta-row">
                            <span class="recipe-info-view__label">Created by</span>
                            <span>{{ recipe.createdByFullName }}</span>
                        </div>

                        <div v-if="recipe.approvedByFullName" class="recipe-info-view__meta-row">
                            <span class="recipe-info-view__label">Approved by</span>
                            <span>{{ recipe.approvedByFullName }}</span>
                        </div>

                        <div class="recipe-info-view__meta-row">
                            <span class="recipe-info-view__label">Categories</span>
                            <div v-if="recipe.recipeCategories.length" class="recipe-info-view__tags">
                                <span v-for="cat in recipe.recipeCategories" :key="cat.id" class="recipe-info-view__tag">
                                    {{ cat.name }}
                                </span>
                            </div>
                            <span v-else class="recipe-info-view__placeholder">No categories</span>
                        </div>
                        <ul v-if="validationErrors?.getByField('recipeCategories')?.length" class="recipe-info-view__field-errors">
                            <li v-for="error in validationErrors?.getByField('recipeCategories')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                        </ul>

                        <div class="recipe-info-view__meta-row">
                            <span class="recipe-info-view__label">Prep time</span>
                            <span v-if="recipe.preparationTime != null">{{ recipe.preparationTime }} min</span>
                            <span v-else class="recipe-info-view__placeholder">Not specified</span>
                        </div>
                        <ul v-if="validationErrors?.getByField('preparationTime')?.length" class="recipe-info-view__field-errors">
                            <li v-for="error in validationErrors?.getByField('preparationTime')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                        </ul>

                        <div class="recipe-info-view__meta-row">
                            <span class="recipe-info-view__label">Servings</span>
                            <span v-if="recipe.servings != null">{{ recipe.servings }}</span>
                            <span v-else class="recipe-info-view__placeholder">Not specified</span>
                        </div>
                        <ul v-if="validationErrors?.getByField('servings')?.length" class="recipe-info-view__field-errors">
                            <li v-for="error in validationErrors?.getByField('servings')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                        </ul>

                        <SectionTitle>Description</SectionTitle>
                        <p v-if="recipe.description" class="recipe-info-view__text">{{ recipe.description }}</p>
                        <p v-else class="recipe-info-view__placeholder">No description</p>
                        <ul v-if="validationErrors?.getByField('description')?.length" class="recipe-info-view__field-errors">
                            <li v-for="error in validationErrors?.getByField('description')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                        </ul>

                        <SectionTitle>Ingredients</SectionTitle>
                        <div v-if="recipe.products.length" class="recipe-info-view__products">
                            <div
                                v-for="product in recipe.products"
                                :key="product.id"
                                class="recipe-info-view__product-row"
                            >
                                <span class="recipe-info-view__product-name">{{ product.name }}</span>
                                <span class="recipe-info-view__product-qty">
                                    {{ product.quantity }} {{ product.unit.abbreviation }}
                                </span>
                            </div>
                        </div>
                        <p v-else class="recipe-info-view__placeholder">No ingredients added.</p>
                        <ul v-if="validationErrors?.getByField('recipeProducts')?.length" class="recipe-info-view__field-errors">
                            <li v-for="error in validationErrors?.getByField('recipeProducts')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                        </ul>
                    </div>

                    <div class="recipe-info-view__instructions">
                        <SectionTitle>Instructions</SectionTitle>
                        <ol v-if="parsedInstructions.length" class="recipe-info-view__steps">
                            <li v-for="(step, index) in parsedInstructions" :key="index" class="recipe-info-view__step">
                                {{ step.text }}
                                <ul v-if="validationErrors?.getByField(`instructions[${index}].text`)?.length" class="recipe-info-view__field-errors">
                                    <li v-for="error in validationErrors?.getByField(`instructions[${index}].text`)?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                                </ul>
                            </li>
                        </ol>
                        <p v-else class="recipe-info-view__placeholder">No instructions added.</p>
                        <ul v-if="validationErrors?.getByField('instructions')?.length" class="recipe-info-view__field-errors">
                            <li v-for="error in validationErrors?.getByField('instructions')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                        </ul>
                    </div>

                    <div v-if="showRevisionNotes" class="recipe-info-view__revision-notes">
                        <SectionTitle>Revision Notes</SectionTitle>
                        <template v-if="recipe.revisionNotes.length">
                            <div
                                v-for="(entry, index) in recipe.revisionNotes.filter(note => note.notes)"
                                :key="index"
                                class="recipe-info-view__revision-entry"
                            >
                                <div class="recipe-info-view__revision-header">
                                    <span class="recipe-info-view__revision-reviewer">{{ entry.userFullName }}</span>
                                    <span class="recipe-info-view__revision-date">{{ new Date(entry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}</span>
                                </div>
                                <p class="recipe-info-view__revision-text">{{ entry.notes }}</p>
                            </div>
                        </template>
                        <p v-else class="recipe-info-view__placeholder">No revision notes.</p>
                    </div>
                </div>

                <div>
                    <SectionTitle>Notes</SectionTitle>
                    <p v-if="recipe.notes" class="recipe-info-view__text">{{ recipe.notes }}</p>
                    <p v-else class="recipe-info-view__placeholder">No notes</p>
                    <ul v-if="validationErrors?.getByField('notes')?.length" class="recipe-info-view__field-errors">
                        <li v-for="error in validationErrors?.getByField('notes')?.slice().sort((a, b) => a.message.localeCompare(b.message))">{{ error.message }}</li>
                    </ul>
                </div>
            </div>
            
        </template>

        <RecipeReturnPopup
            v-if="returnPopupOpen && recipe"
            :recipe-id="recipe.id"
            @done="handleReturnDone"
            @close="returnPopupOpen = false"
        />

        <RecipeConfirmPopup
            v-if="approvePopupOpen"
            message="Approve this recipe?"
            @confirm="handleApprove"
            @close="approvePopupOpen = false"
        />

        <RecipeConfirmPopup
            v-if="selfApprovePopupOpen"
            message="Approve this recipe?"
            @confirm="handleSelfApprove"
            @close="selfApprovePopupOpen = false"
        />

        <RecipeConfirmPopup
            v-if="discardPopupOpen"
            message="Discard this recipe?"
            @confirm="handleDiscard"
            @close="discardPopupOpen = false"
        />

        <RecipeSubmitPopup
            v-if="submitPopupOpen && recipe"
            :recipe-id="recipe.id"
            @done="handleSubmitDone"
            @close="submitPopupOpen = false"
        />

        <RecipeConfirmPopup
            v-if="archivePopupOpen"
            message="Archive this recipe?"
            @confirm="handleArchive"
            @close="archivePopupOpen = false"
        />

        <RecipeConfirmPopup
            v-if="returnToApprovedPopup"
            message="Return this recipe to approved?"
            @confirm="handleReturnToApproved"
            @close="returnToApprovedPopup = false"
        />

        <RecipeConfirmPopup
            v-if="deletePopupOpen"
            message="Delete this recipe?"
            @confirm="handleDelete"
            @close="deletePopupOpen = false"
        />
        
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import { useAuth } from '@/store/auth/auth'
import { Role } from '@/components/users/users-models'
import type { RecipeDetail, Instruction } from '@/components/recipes/recipes-models'

import router from '@/router/index'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheButton from '@/components/base/TheButton.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import SectionTitle from '@/components/base/SectionTitle.vue'
import RecipeReturnPopup from '@/components/recipes/RecipeReturnPopup.vue'
import RecipeConfirmPopup from '@/components/recipes/RecipeConfirmPopup.vue'
import RecipeSubmitPopup from '@/components/recipes/RecipeSubmitPopup.vue'

const route = useRoute()
const authStore = useAuth()

const recipe = ref<RecipeDetail | undefined>(undefined)
const validationErrors = ref<UnprocessableContentError | undefined>(undefined)
const returnPopupOpen = ref(false)
const approvePopupOpen = ref(false)
const selfApprovePopupOpen = ref(false)
const discardPopupOpen = ref(false)
const submitPopupOpen = ref(false)
const archivePopupOpen = ref(false)
const returnToApprovedPopup = ref(false)
const deletePopupOpen = ref(false)

const isLineCook = computed(() => authStore.user?.hasRoles([Role.LINE_COOK]) ?? false)
const isChef = computed(() => authStore.user?.hasRoles([Role.CHEF]) ?? false)

const showEdit = computed(() => {
    if (!recipe.value) return false
    const s = recipe.value.status
    if (!recipe.value.createdByCurrentUser) return false
    if (isLineCook.value) return s === 'DRAFT' || s === 'RETURNED_FOR_REVISION'
    if (isChef.value) return s === 'DRAFT' || s === 'APPROVED'
    return false
})

const showReturn = computed(() =>
    isChef.value && recipe.value?.status === 'WAITING_FOR_APPROVAL'
)

const showApprove = computed(() =>
    isChef.value && recipe.value?.status === 'WAITING_FOR_APPROVAL'
)

const showSelfApprove = computed(() => {
    if (!recipe.value || !recipe.value.createdByCurrentUser) return false
    if (!isChef.value) return false
    return recipe.value.status === 'DRAFT' || recipe.value.status === 'RETURNED_FOR_REVISION'
})

const showDiscard = computed(() => 
    isChef.value && recipe.value?.status === 'WAITING_FOR_APPROVAL'
);

const showSubmit = computed(() => {
    if (!recipe.value || !recipe.value.createdByCurrentUser) return false
    return isLineCook.value && (recipe.value.status === 'DRAFT' || recipe.value.status === 'RETURNED_FOR_REVISION')
})

const showArchive = computed(() => 
    isChef.value && recipe.value?.status === 'APPROVED'
);

const showReturnToApproved = computed(() => 
    isChef.value && recipe.value?.status === 'ARCHIVED'
);

const showDelete = computed(() => {
    if (!recipe.value || !recipe.value.createdByCurrentUser) return false
    return (isLineCook.value || isChef.value) && recipe.value.status === 'DRAFT'
})

const showHistory = computed(() =>
    (isLineCook.value || isChef.value) && recipe.value?.status !== 'DRAFT'
)

const showRevisionNotes = computed(() => 
    isLineCook.value && recipe.value?.status === 'RETURNED_FOR_REVISION'
)

const statusLabel = computed(() => {
    const map: Record<string, string> = {
        DRAFT: 'Draft',
        WAITING_FOR_APPROVAL: 'Pending Approval',
        RETURNED_FOR_REVISION: 'Returned for Revision',
        APPROVED: 'Approved',
        ARCHIVED: 'Archived',
        DISCARDED: 'Discarded',
    }
    return map[recipe.value?.status ?? ''] ?? recipe.value?.status ?? ''
})

const parsedInstructions = computed<Instruction[]>(() => {
    if (!recipe.value?.instructions) return []
    try {
        return JSON.parse(recipe.value.instructions)
    } catch {
        return []
    }
})

async function fetchRecipe() {
    recipe.value = await new APICall<RecipeDetail>(`recipes/${route.params.id}`).execute()
}


async function handleReturnDone() {
    returnPopupOpen.value = false
    router.replace({ name: "recipes" })
}

async function handleSelfApprove() {
    selfApprovePopupOpen.value = false
    const id = recipe.value!.id
    try {
        recipe.value = undefined
        await new APICall(`recipes/${id}/self-approve`, 'POST').execute()
        await fetchRecipe()
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            await fetchRecipe()
            validationErrors.value = e
        }
    }
}

async function handleApprove() {
    approvePopupOpen.value = false
    const id = recipe.value!.id
    try {
        recipe.value = undefined
        await new APICall(`recipes/${id}/approve`, 'POST').execute()
        await fetchRecipe()
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            await fetchRecipe()
            validationErrors.value = e
        }
    }
}

async function handleSubmitDone() {
    submitPopupOpen.value = false
    await fetchRecipe()
}

async function handleArchive() {
    const recipeId = recipe.value?.id;
    recipe.value = undefined;
    archivePopupOpen.value = false
    await new APICall(`recipes/${recipeId}/archive`, 'POST').execute()
    await fetchRecipe();
}

async function handleReturnToApproved() {
    returnToApprovedPopup.value = false
    const recipeId = recipe.value?.id;

    try {
        recipe.value = undefined;
        await new APICall(`recipes/${recipeId}/unarchive`, 'POST').execute()
        await fetchRecipe();
    } catch (e) {
        if (e instanceof UnprocessableContentError) {
            await fetchRecipe()
            validationErrors.value = e
        }
    }
}

 
async function handleDelete() {
    const recipeId = recipe.value?.id;
    recipe.value = undefined;
    deletePopupOpen.value = false
    await new APICall(`recipes/draft/${recipeId}`, 'DELETE').execute()
    router.replace('/recipes')
}

async function handleDiscard() {
    const recipeId = recipe.value?.id;
    recipe.value = undefined;
    discardPopupOpen.value = false;
    await new APICall(`recipes/${recipeId}/discard`, 'POST').execute()
    await fetchRecipe()
}

onMounted(() => fetchRecipe())
</script>

<style lang="scss">
    .recipe-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recipe-info-view__title-and-history-button__wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: 100%;    

        & > span {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .recipe-info-view__toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .recipe-info-view__button {
        width: 90px;
        padding: 4px;

        &--history {
            @extend .recipe-info-view__button;

            width: 80px;
            font-size: 14px;
            font-weight: normal;
        }
    }

    .recipe-info-view__wrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .recipe-info-view__body {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 30px;
        align-items: flex-start;
    }

    .recipe-info-view__details {
        min-width: 0;
        width: 100%;

        @include desktop {
            width: 300px;
        }
    }

    .recipe-info-view__instructions {
        flex: 1;
        min-width: 0;
    }

    .recipe-info-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .recipe-info-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .recipe-info-view__status {
        padding: 4px 10px;
        border-radius: 3px;
        font-size: 14px;

        &--draft { background: #e8e8e8; color: #555; border: 1px solid #555; }
        &--approved { background: #d4edda; color: #256236; border: 1px solid #256236; }
        &--waiting_for_approval { background: #fff3cd; color: #856404; border: 1px solid #856404; }
        &--returned_for_revision { background: #fde2cc; color: #7a4310; border: 1px solid #7a4310; }
        &--archived { background: #dde0e8; color: #3a3f55; border: 1px solid #3a3f55; }
        &--discarded { background: #f5c6cb; color: #721c24; border: 1px solid #721c24; }
    }

    .recipe-info-view__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .recipe-info-view__tag {
        padding: 4px 10px;
        background: #e9f0fb;
        border: 1px solid #2d5aa0;
        border-radius: 3px;
        font-size: 12px;
        color: #2d5aa0;
    }

    .recipe-info-view__text {
        margin-bottom: 8px;
        line-height: 1.5;
        white-space: pre-wrap;
    }

    .recipe-info-view__products {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .recipe-info-view__product-row {
        width: 200px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .recipe-info-view__product-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
    }

    .recipe-info-view__product-qty {
        flex-shrink: 0;
    }

    .recipe-info-view__steps {
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .recipe-info-view__step {
        line-height: 1.5;
    }

    .recipe-info-view__placeholder {
        color: #999;
        margin-bottom: 8px;
    }

    .recipe-info-view__revision-notes {
        width: 100%;

        @include desktop {
            width: 200px;
            flex-shrink: 0;
        }
    }

    .recipe-info-view__revision-entry {
        padding: 10px 12px;
        border: 1px solid $lightGrayBorder;
        border-radius: 4px;
        background: white;
        margin-bottom: 10px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            0 1px 2px rgba(0, 0, 0, 0.08);
    }

    .recipe-info-view__revision-header {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 6px;
    }

    .recipe-info-view__revision-reviewer {
        font-weight: bold;
        font-size: 14px;
        color: $fontColorMain;
    }

    .recipe-info-view__revision-date {
        font-size: 12px;
        color: #888;
        flex-shrink: 0;
    }

    .recipe-info-view__revision-text {
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        white-space: pre-wrap;
        margin: 0;
    }

    .recipe-info-view__field-errors {
        color: $fontColorError;
        font-weight: normal;
        text-align: justify;
        margin-bottom: 8px;
    }
</style>
