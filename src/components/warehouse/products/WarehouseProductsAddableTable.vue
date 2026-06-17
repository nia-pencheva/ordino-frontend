<template>
    <div class="warehouse-products-addable-table">
        <WarehouseProductsAddableTableRow
            v-for="product in products"
            :key="product.id"
            :product="product"
        />
    </div>
</template>

<script setup lang="ts">
    import { WarehouseProductsAddableProduct } from './warehouse-products-models';
    import WarehouseProductsAddableTableRow from './WarehouseProductsAddableTableRow.vue';

    interface Props {
        products: WarehouseProductsAddableProduct[] | undefined
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .warehouse-products-addable-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
