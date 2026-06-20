<template>
    <div
        class="supplier-products-table__row"
        @click="router.push({ name: 'supplier-product-info', params: { supplierId: props.supplierId, supplierProductId: props.product.id } })"
    >
        <p class="supplier-products-table__row__name">{{ props.product.productName }}</p>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { SupplierProduct } from './suppliers-models'

    const router = useRouter()

    interface Props {
        product: SupplierProduct
        supplierId?: string | number
    }

    const props = defineProps<Props>()
</script>

<style lang="scss">
    .supplier-products-table__row {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: $tableRowHeight;
        padding: 10px;
        background-color: white;
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

    .supplier-products-table__row__name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
    }
</style>
