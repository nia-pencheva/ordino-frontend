<template>
    <div class="products-table">
        <ProductsTableRow
            v-for="product in products"
            :key="product.id"
            :product="product"
            @activated-product="() => emit('activated-product')"
            @open-deactivate-popup="(product) => emit('open-deactivate-popup', product)"
            @open-delete-popup="(product) => emit('open-delete-popup', product)"
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

    const emit = defineEmits<{
        'open-deactivate-popup': [product: Product]
        'open-delete-popup': [product: Product]
        'activated-product': []
    }>();
</script>

<style lang="scss">
    .products-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
</style>
