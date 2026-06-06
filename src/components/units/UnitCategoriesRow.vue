<template>
    <div class="units-table__category-row__wrapper">
        <div
            class="units-table__category-row"
            @click="toggleDetails"
            :class="[ detailsOpen ? 'units-table__category-row--details-open' : 'units-table__category-row--details-closed' ]"
        >
            <div>
                {{ props.unitCategory.category }}
            </div>

            <div>
                <TheButton class="units-table__toggle-details">
                    <i :class="[ detailsOpen ? 'units-table__toggle-details__icon--close' : 'units-table__toggle-details__icon--open' ]"></i>
                </TheButton>
            </div>
        </div>
        
        <div
            v-if="detailsOpen"
            class="units-table__category-row__details__wrapper"
        >
            <div class="units-table__category-row__details__actions">
                <TheButton
                    class="units-table__category-row__details__actions__button"
                    @click="router.push({ name: 'add-unit', query: { id: props.unitCategory.id, categoryName: props.unitCategory.category } })"
                >
                    Add Unit
                </TheButton>
                <TheButton
                    class="units-table__category-row__details__actions__button"
                    @click="router.push({ name: 'edit-unit-category', params: { id: props.unitCategory.id } })"
                >
                    Edit
                </TheButton>

                <TheButton
                    class="units-table__category-row__details__actions__button"
                    type="important"
                    :disabled="!props.unitCategory.canBeDeleted"
                    :tooltip="props.unitCategory.canBeDeleted ? [] : [ 'Cannot delete unit category with undeletable units' ]"
                    @click="openDeleteUnitCategoryPopup(props.unitCategory)"
                >
                    Delete
                </TheButton>
            </div>

            <div
                v-if="unitCategory.units.length > 0"
                class="units-table__category-row__units"
            >
                <UnitRow 
                    v-for="unit in unitCategory.units"
                    :key="unit.id"
                    :unit="unit"
                />
            </div>
            <div 
                v-else
                class="units-table__category-row__no-units"
            >
                <p>No units have been added to this category yet</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { inject, ref } from 'vue';
    import { UnitCategoryForUnitsPage } from './units-models';
    import router from '@/router';

    import TheButton from '../base/TheButton.vue';
    import UnitRow from './UnitRow.vue';

    interface Props {
        unitCategory: UnitCategoryForUnitsPage
    }

    const props = defineProps<Props>();

    const detailsOpen = ref<boolean>(false);

    function toggleDetails() {
        detailsOpen.value = !detailsOpen.value;
    }

    const openDeleteUnitCategoryPopup: (unitCategory: UnitCategoryForUnitsPage) => void = inject("openDeleteUnitCategoryPopup")!
</script>

<style lang="scss">
    .units-table__category-row__wrapper {
        border: 1px solid $midGray;
        border-radius: 5px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);
    }

    .units-table__category-row {
        padding: 10px;
        border-bottom: 1px solid $lightGrayBorder;
        background: linear-gradient(#fff, #dcdcdc);
    }

    [class*="units-table__category-row--"] {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        border-radius: 5px;
    }

    .units-table__category-row--details-open {
        border-radius: 5px 5px 0px 0px;
    }

    .units-table__category-row--details-closed {
        border-radius: 5px;
    }

    .units-table__toggle-details {
        right: 5px;
        top: 10px;
        width: 25px;
        height: 25px;
        font-size: 18px;
    }

    .units-table__toggle-details__icon--open {
        @include arrow-down(black, 2px);

        position: relative;
        bottom: 2px;
        right: 0px;
    }

    .units-table__toggle-details__icon--close {
        @include arrow-up(black, 2px);

        position: relative;
        top: 1px;
        left: 0px;
    }

    .units-table__category-row__details__wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        border-radius: 0px 0px 5px 5px;
        background-color: white;
    }

    .units-table__category-row__units {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .units-table__category-row__no-units {
        width: 100%;
    }

    .units-table__category-row__details__actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
    }

    .units-table__category-row__details__actions__button {
        width: 75px;
        padding: 4px;
    }
</style>