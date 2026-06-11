<template>
    <div
        class="warehouse-product-categories-product-row"
        @click="router.push({ name: 'product-info', params: { id: props.product.id } })"
    >
        <p class="warehouse-product-categories-product-row__name">{{ product.name }}</p>
        <TheButton
            type="important"
            class="warehouse-product-categories-product-row__remove"
            @click.stop="openRemoveProductPopup(product, parentCategory)"
        >
            Remove
        </TheButton>
    </div>
</template>

<script setup lang="ts">
    import type { WarehouseProductCategory, WarehouseProductCategoryProduct } from './warehouse-product-categories-models';
    import { inject } from 'vue';
    import router from '@/router';

    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        product: WarehouseProductCategoryProduct
        parentCategory: WarehouseProductCategory
    }

    const props = defineProps<Props>();

    const openRemoveProductPopup: (product: WarehouseProductCategoryProduct, parentCategory: WarehouseProductCategory) => void = inject('openRemoveProductPopup')!;
</script>

<style lang="scss">
    .warehouse-product-categories-product-row {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px;
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

    .warehouse-product-categories-product-row__remove {
        padding: 4px 10px;
        flex-shrink: 0;
    }
</style>
