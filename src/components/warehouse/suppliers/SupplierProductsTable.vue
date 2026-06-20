<template>
    <div class="supplier-products-table">
        <SupplierProductsTableRow
            v-for="product in products"
            :key="product.id"
            :product="product"
            :supplier-id="props.supplierId"
        />
    </div>
</template>

<script setup lang="ts">
    import { SupplierProduct } from './suppliers-models'

    import SupplierProductsTableRow from './SupplierProductsTableRow.vue'

    interface Props {
        products: SupplierProduct[] | undefined
        supplierId?: string | number
    }

    const props = defineProps<Props>()
</script>

<style lang="scss">
    .supplier-products-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
