<template>
    <div class="units-table__unit-row">
        <div class="units-table__unit-row__name__wrapper">
            <span class="units-table__unit-row__name">{{ props.unit.unit }}</span>
            <span class="units-table__unit-row__abbreviation">({{ props.unit.abbreviation }})</span>
        </div>

        <div class="units-table__unit-row__buttons">
            <TheButton
                class="units-table__unit-row__button"
                @click="router.push('/units/' + props.unit.id)"
            >
                Edit
            </TheButton>

            <TheButton
                class="units-table__unit-row__button"
                type="important"
                :disabled="props.unit.deleteForbiddenReasons.length > 0"
                :tooltip="props.unit.deleteForbiddenReasons"
                @click="openDeleteUnitPopup(props.unit)"
            >
                Delete
            </TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { UnitForUnitsPage } from './units-models';
    import { inject } from 'vue';

    import TheButton from '../base/TheButton.vue';

    const router = useRouter();

    interface Props {
        unit: UnitForUnitsPage
    }

    const props = defineProps<Props>();

    const openDeleteUnitPopup: ((unit: UnitForUnitsPage) => void) = inject('openDeleteUnitPopup')!;
</script>

<style lang="scss">
    .units-table__unit-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;

        border: 1px solid $midGray;
    }

    .units-table__unit-row__name__wrapper {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        font-size: 14px;
    }

    .units-table__unit-row__name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .units-table__unit-row__abbreviation {
        color: #999;
        font-size: 13px;
    }

    .units-table__unit-row__buttons {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    .units-table__unit-row__button {
        width: 60px;
        padding: 4px;
    }
</style>
