<template>
    <div class="warehouse-remove-product-popup__overlay">
        <TheWindow>
            <div class="warehouse-remove-product-popup__content">
                <p>Remove product <b>{{ product.name }}</b> <br>from category <b>{{ parentCategory.category }}</b>?</p>

                <div class="warehouse-remove-product-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { WarehouseProductCategory, WarehouseProductCategoryProduct } from './warehouse-product-categories-models';

    import TheWindow from '@/components/base/TheWindow.vue';
    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        parentCategory: WarehouseProductCategory
        product: WarehouseProductCategoryProduct
    }

    const props = defineProps<Props>();

    const emit = defineEmits(['close', 'removed-product']);

    async function handleConfirm() {
        await (new APICall(`warehouse-product-categories/${props.parentCategory.id}/remove-product/${props.product.id}`, 'DELETE')).execute();
        emit('removed-product');
    }
</script>

<style lang="scss">
    .warehouse-remove-product-popup__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .warehouse-remove-product-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;

        p {
            text-align: center;
        }
    }

    .warehouse-remove-product-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .warehouse-remove-product-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
