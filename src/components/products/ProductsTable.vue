<template>
    <div class="products-table">
        <ProductsTableRow
            v-for="product in products"
            :key="product.id"
            :product="product"
        />
    </div>
</template>

<script setup lang="ts">
    import { Product } from './products-models';
    import ProductsTableRow from './ProductsTableRow.vue';

    interface Props {
        products: Product[] | undefined
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .products-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
