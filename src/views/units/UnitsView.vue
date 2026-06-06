<template>
    <TheLayout>
        <TheTitle>Units</TheTitle>

        <div class="units-view__toolbar">
            <TheButton @click="router.push('/unit-categories/add')">
                Add Category
            </TheButton>
        </div>

        <div class="units-view__content">
            <div
                v-if="!loaded"
                class="units-view__loader"
            >
                <TheSpinner size="lg" />
            </div>
            <template v-else>
                <UnitsTable
                    v-if="(unitsPage?.totalElements ?? 0) > 0"
                    :unitCategories="unitsPage?.unitCategories"
                />

                <div
                    v-else
                    class="units-view__no-results"
                >
                    <p>No units have been added yet</p>
                </div>
            </template>
            <ThePager
                v-if="(unitsPage?.totalElements ?? 0) > pageSize"
                :current-page="currentPage"
                :total-pages="unitsPage?.totalPages"
                @previous="getPreviousPage()"
                @next="getNextPage()"
            />
        </div>

        <DeleteUnitPopup
            v-if="deleteUnitPopup != undefined"
            :unit="deleteUnitPopup"
            @close="deleteUnitPopup = undefined"
            @deleted-unit="handleUnitDeleted"
        />

        <DeleteUnitCategoryPopup 
            v-if="deleteUnitCategoryPopup != undefined"
            :unit-category="deleteUnitCategoryPopup"
            @close="deleteUnitCategoryPopup = undefined"
            @deleted-unit-category="handleUnitCategoryDeleted"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, provide, ref } from 'vue';
    import { UnitForUnitsPage, UnitCategoryForUnitsPage, UnitsPage } from '@/components/units/units-models';
    import { APICall } from '@/service/api/api';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import UnitsTable from '@/components/units/UnitsTable.vue';
    import DeleteUnitPopup from '@/components/units/DeleteUnitPopup.vue';
    import DeleteUnitCategoryPopup from '@/components/units/DeleteUnitCategoryPopup.vue';

    import router from '@/router';

    const pageSize = 10;

    const unitsPage = ref<UnitsPage | undefined>(undefined);
    const currentPage = ref<number>(1);

    const deleteUnitPopup = ref<UnitForUnitsPage | undefined>(undefined);
    const deleteUnitCategoryPopup = ref<UnitCategoryForUnitsPage | undefined>(undefined);

    const loaded = computed<boolean>(() => unitsPage.value != undefined);

    function openDeleteUnitPopup(unit: UnitForUnitsPage) {
        deleteUnitPopup.value = unit;
    }

    function openDeleteUnitCategoryPopup(unitCategory: UnitCategoryForUnitsPage) {
        deleteUnitCategoryPopup.value = unitCategory;
    }

    async function handleUnitDeleted() {
        deleteUnitPopup.value = undefined;
        await fetchUnits();
    }

    async function handleUnitCategoryDeleted() {
        deleteUnitCategoryPopup.value = undefined;
        currentPage.value = 1;
        await fetchUnits();
    }

    async function fetchUnits() {
        unitsPage.value = await (new APICall<UnitsPage>(`units?page=${currentPage.value}&pageSize=${pageSize}`)).execute();
    }

    async function getNextPage() {
        currentPage.value++;
        unitsPage.value = undefined;
        await fetchUnits();
    }

    async function getPreviousPage() {
        currentPage.value--;
        unitsPage.value = undefined;
        await fetchUnits();
    }

    onMounted(async () => {
        await fetchUnits();
    });

    provide('openDeleteUnitPopup', openDeleteUnitPopup);
    provide('openDeleteUnitCategoryPopup', openDeleteUnitCategoryPopup);
</script>

<style lang="scss">
    .units-view__toolbar {
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
    }

    .units-view__toolbar .the-button {
        width: 110px;
        padding: 4px;
    }

    .units-view__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .units-view__loader {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 600px;
    }

    .units-view__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 600px;

        p {
            font-weight: bold;
        }
    }
</style>
