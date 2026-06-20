<template>
    <div class="suppliers-table">
        <SuppliersTableRow
            v-for="supplier in suppliers"
            :key="supplier.id"
            :supplier="supplier"
        />
    </div>
</template>

<script setup lang="ts">
    import { SupplierForPage } from './suppliers-models'

    import SuppliersTableRow from './SuppliersTableRow.vue'

    interface Props {
        suppliers: SupplierForPage[] | undefined
    }

    const props = defineProps<Props>()
</script>

<style lang="scss">
    .suppliers-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
