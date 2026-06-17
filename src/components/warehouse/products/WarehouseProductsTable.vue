<template>
    <div class="warehouse-products-table">
        <WarehouseProductsTableRow
            v-for="warehouseProduct in warehouseProducts"
            :key="warehouseProduct.id"
            :warehouse-product="warehouseProduct"
        />
    </div>
</template>

<script setup lang="ts">
    import { WarehouseProductForPage } from './warehouse-products-models';
    import WarehouseProductsTableRow from './WarehouseProductsTableRow.vue';

    interface Props {
        warehouseProducts: WarehouseProductForPage[] | undefined
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .warehouse-products-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
