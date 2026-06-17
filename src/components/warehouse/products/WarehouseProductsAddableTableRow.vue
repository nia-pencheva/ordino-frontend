<template>
    <div class="warehouse-products-addable-table__row">
        <p>{{ props.product.name }}</p>
        <TheButton
            class="warehouse-products-addable-table__add-button"
            @click="router.push({ name: 'add-warehouse-product', params: { id: props.product.id } })"
        >
            Add
        </TheButton>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';

    import TheButton from '@/components/base/TheButton.vue';

    import { WarehouseProductsAddableProduct } from './warehouse-products-models';

    const router = useRouter();

    interface Props {
        product: WarehouseProductsAddableProduct
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .warehouse-products-addable-table__row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
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

        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .warehouse-products-addable-table__add-button {
        width: 50px;
        padding: 4px;
        flex-shrink: 0;
    }
</style>
