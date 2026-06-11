<template>
    <div class="units-table">
        <UnitCategoriesTableRow 
            v-for="unitCategory in props.unitCategories"
            :key="unitCategory.id"
            :unit-category="unitCategory"
        />
    </div>
</template>

<script setup lang="ts">
    import { UnitCategoryForUnitsPage } from './units-models';

    import UnitCategoriesTableRow from './UnitCategoriesRow.vue';

    interface Props {
        unitCategories: UnitCategoryForUnitsPage[] | undefined
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .units-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
