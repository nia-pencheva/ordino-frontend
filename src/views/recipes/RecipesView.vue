<template>
    <TheLayout>
        <TheTitle>Recipes</TheTitle>

        <div class="recipes-view__toolbar">
            <TheSearchbar
                v-model="searchTitle"
                placeholder="Search by title..."
            />

            <div class="recipes-view__toolbar__buttons">
                <TheSelect
                    v-model="selectedCategoryId"
                    :options="categoryOptions"
                    placeholder="All categories"
                    class="recipes-view__category-filter"
                />

                <TheButton
                    v-if="showAddButton"
                    @click="handleAddRecipe"
                    class="recipes-view__add-button"
                >
                    Add
                </TheButton>
            </div>
        </div>

        <div class="recipes-view__tabs">
            <div
                v-if="showActiveTab"
                @click="selectMainTab('active')"
                :class="['recipes-view__tab', { 'recipes-view__tab--active': mainTab === 'active' }]"
            >
                Active
            </div>
            <div
                v-if="showArchivedTab"
                @click="selectMainTab('archived')"
                :class="['recipes-view__tab', { 'recipes-view__tab--active': mainTab === 'archived' }]"
            >
                Archived
            </div>
            <div
                v-if="showDiscardedTab"
                @click="selectMainTab('discarded')"
                :class="['recipes-view__tab', { 'recipes-view__tab--active': mainTab === 'discarded' }]"
            >
                Discarded
            </div>
        </div>

        <div class="recipes-view__tab__wrapper">
            <div v-if="mainTab === 'active'" class="recipes-view__subtabs">
                <div
                    v-for="subtab in visibleActiveSubtabs"
                    :key="subtab.id"
                    @click="selectSubtab(subtab.id)"
                    :class="['recipes-view__subtab', { 'recipes-view__subtab--active': activeSubtab === subtab.id }]"
                >
                    {{ subtab.label }}
                </div>
            </div>

            <div
                v-if="!loaded"
                class="recipes-view__loader"
            >
                <TheSpinner size="lg"/>
            </div>
            <template v-else>
                <div
                    v-if="(recipesPage?.totalElements ?? 0) != 0"
                    class="recipes-view__results"
                >
                    <RecipesTable :recipes="recipesPage?.recipes" />

                    <ThePager
                        v-if="(recipesPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="recipesPage?.totalPages"
                        @previous="getPreviousPage()"
                        @next="getNextPage()"
                    />
                </div>

                <div
                    v-else
                    class="recipes-view__no-results"
                >
                    <p>No recipes found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuth } from '@/store/auth/auth';
    import { Role } from '@/components/users/users-models';
    import { RecipesPage } from '@/components/recipes/recipes-models';
    import { RecipeCategoriesPage } from '@/components/recipes/categories/recipe-categories-models';
    import { APICall } from '@/service/api/api';
    import { SelectOption } from '@/components/base/TheSelect.vue';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSearchbar from '@/components/base/TheSearchbar.vue';
    import TheSelect from '@/components/base/TheSelect.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import RecipesTable from '@/components/recipes/RecipesTable.vue';

    interface Subtab {
        id: string
        label: string
        statusName: string
    }

    const ALL_ACTIVE_SUBTABS: Subtab[] = [
        { id: 'approved',  label: 'Approved',         statusName: 'APPROVED'              },
        { id: 'drafts',    label: 'Drafts',            statusName: 'DRAFT'                 },
        { id: 'pending',   label: 'Pending Approval',  statusName: 'WAITING_FOR_APPROVAL'  },
        { id: 'revision',  label: 'For Revision',      statusName: 'RETURNED_FOR_REVISION' },
        { id: 'review',    label: 'For Review',        statusName: 'WAITING_FOR_APPROVAL'  },
    ]

    const router = useRouter();

    const authStore = useAuth();

    const pageSize = 10;

    const recipesPage = ref<RecipesPage | undefined>(undefined);
    const searchTitle = ref<string>('');
    const selectedCategoryId = ref<number>(0);
    const mainTab = ref<'active' | 'archived' | 'discarded'>('active');
    const activeSubtab = ref<string>('approved');
    const currentPage = ref<number>(1);
    const categories = ref<{ id: number; category: string }[]>([]);

    const loaded = computed<boolean>(() => recipesPage.value !== undefined);

    const showActiveTab = computed(() =>
        authStore.user?.hasRoles([Role.KITCHEN_STAFF, Role.LINE_COOK, Role.CHEF, Role.MANAGER]) ?? false
    );

    const showArchivedTab = computed(() =>
        authStore.user?.hasRoles([Role.LINE_COOK, Role.CHEF, Role.MANAGER]) ?? false
    );

    const showDiscardedTab = computed(() =>
        authStore.user?.hasRoles([Role.LINE_COOK, Role.CHEF]) ?? false
    );

    const showAddButton = computed(() =>
        authStore.user?.hasRoles([Role.LINE_COOK, Role.CHEF]) ?? false
    );

    const visibleActiveSubtabs = computed<Subtab[]>(() => {
        const user = authStore.user;
        if (!user) return [];
        return ALL_ACTIVE_SUBTABS.filter(subtab => {
            switch (subtab.id) {
                case 'approved': return user.hasRoles([Role.KITCHEN_STAFF, Role.LINE_COOK, Role.CHEF, Role.MANAGER]);
                case 'drafts':   return user.hasRoles([Role.LINE_COOK, Role.CHEF]);
                case 'pending':  return user.hasRoles([Role.LINE_COOK]);
                case 'revision': return user.hasRoles([Role.LINE_COOK]);
                case 'review':   return user.hasRoles([Role.CHEF]);
                default:         return false;
            }
        });
    });

    const currentStatusName = computed<string>(() => {
        if (mainTab.value === 'archived') return 'ARCHIVED';
        if (mainTab.value === 'discarded') return 'DISCARDED';
        return visibleActiveSubtabs.value.find(s => s.id === activeSubtab.value)?.statusName ?? 'APPROVED';
    });

    const categoryOptions = computed<SelectOption[]>(() => [
        { value: 0, label: 'All categories' },
        ...categories.value.map(c => ({ value: c.id, label: c.category })),
    ]);

    let debounceTimer: ReturnType<typeof setTimeout>;

    watch(searchTitle, () => {
        clearTimeout(debounceTimer);
        currentPage.value = 1;
        recipesPage.value = undefined;
        debounceTimer = setTimeout(fetchRecipes, 400);
    });

    watch(selectedCategoryId, () => {
        currentPage.value = 1;
        recipesPage.value = undefined;
        fetchRecipes();
    });

    async function fetchRecipes() {
        let path = `recipes?pageSize=${pageSize}&page=${currentPage.value}&recipeStatus=${currentStatusName.value}`;

        if (searchTitle.value.trim()) {
            path += `&searchTitle=${encodeURIComponent(searchTitle.value.trim())}`;
        }
        if (selectedCategoryId.value !== 0) {
            path += `&recipeCategoryId=${selectedCategoryId.value}`;
        }

        recipesPage.value = await (new APICall<RecipesPage>(path)).execute();
    }

    async function getNextPage() {
        currentPage.value++;
        recipesPage.value = undefined;
        await fetchRecipes();
    }

    async function getPreviousPage() {
        currentPage.value--;
        recipesPage.value = undefined;
        await fetchRecipes();
    }

    function selectMainTab(tab: 'active' | 'archived' | 'discarded') {
        if (mainTab.value === tab) return;
        mainTab.value = tab;
        if (tab === 'active') {
            activeSubtab.value = visibleActiveSubtabs.value[0]?.id ?? 'approved';
        }
        currentPage.value = 1;
        recipesPage.value = undefined;
        fetchRecipes();
    }

    function selectSubtab(subtabId: string) {
        if (activeSubtab.value === subtabId) return;
        activeSubtab.value = subtabId;
        currentPage.value = 1;
        recipesPage.value = undefined;
        fetchRecipes();
    }

    function handleAddRecipe() {
        router.push('/recipes/new/edit');
    }

    async function fetchCategories() {
        const page = await (new APICall<RecipeCategoriesPage>('recipe-categories?page=1&pageSize=100')).execute();
        categories.value = page.recipeCategories;
    }

    onMounted(async () => {
        mainTab.value = showActiveTab.value ? 'active' : 'archived';
        activeSubtab.value = visibleActiveSubtabs.value[0]?.id ?? 'approved';

        await Promise.all([fetchRecipes(), fetchCategories()]);
    });
</script>

<style lang="scss">
    .recipes-view__toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 20px;
    }

    .recipes-view__toolbar__buttons {
        display: flex; 
        flex-direction: row; 
        align-items: center;
        gap: 10px;
    }

    .recipes-view__add-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
        margin-left: auto;
    }

    .recipes-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .recipes-view__tab {
        padding: 5px 16px;
        cursor: pointer;
        border: 1px solid $lightGrayBorder;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        background: $darkGray;
        color: #888;
        font-size: 14px;
        user-select: none;
        margin-right: 2px;

        &:hover:not(.recipes-view__tab--active) {
            background: darken($darkGray, 4%);
        }

        &--active {
            background: white;
            color: $fontColorMain;
            position: relative;
            z-index: 1;
            margin-bottom: -1px;
            border: 1px solid #9d9d9d;
            border-bottom: 1px solid white;
            clip-path: inset(-10px -10px 0px -10px);

            @include glass-gray-shadow();
        }
    }

    .recipes-view__tab__wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 15px 5px 5px;
        gap: 15px;
        clip-path: inset(-10px 0px 1px 1px);

        @include glass-gray-shadow();
    }

    .recipes-view__subtabs {
        display: flex;
        flex-direction: row;
        gap: 6px;
        overflow-x: auto;
        flex-shrink: 0;
        padding-bottom: 4px;
        scrollbar-width: thin;
        scrollbar-color: $midGray transparent;

        &::-webkit-scrollbar {
            height: 3px;
        }

        &::-webkit-scrollbar-thumb {
            background: $midGray;
            border-radius: 2px;
        }
    }

    .recipes-view__subtab {
        padding: 5px 14px;
        border-radius: 3px;
        border: 1px solid $lightGrayBorder;
        background: $darkGray;
        color: #888;
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
        user-select: none;

        &:hover:not(.recipes-view__subtab--active) {
            background: darken($darkGray, 4%);
        }

        &--active {
            background: white;
            color: $fontColorMain;
            border-color: #9d9d9d;

            @include glass-gray-shadow();
        }
    }

    .recipes-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recipes-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .recipes-view__no-results {
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
