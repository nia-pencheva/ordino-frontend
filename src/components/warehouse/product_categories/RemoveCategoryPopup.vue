<template>
    <div class="warehouse-remove-category-popup__overlay">
        <TheWindow>
            <div class="warehouse-remove-category-popup__content">
                <p>Remove category <b>{{ category.category }}</b>?</p>
                <p v-if="subCategoryCount > 0" class="warehouse-remove-category-popup__warning">
                    This will also delete <b>{{ subCategoryCount }}</b> subcategor{{ subCategoryCount === 1 ? 'y' : 'ies' }}
                </p>

                <div class="warehouse-remove-category-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { APICall } from '@/service/api/api';
    import type { WarehouseProductCategory } from './warehouse-product-categories-models';

    import TheWindow from '@/components/base/TheWindow.vue';
    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        category: WarehouseProductCategory
    }

    const props = defineProps<Props>();

    const emit = defineEmits(['close', 'removed-category']);

    const subCategoryCount = computed(() => countDescendants(props.category));

    function countDescendants(cat: WarehouseProductCategory): number {
        return (cat.subCategories ?? []).reduce((sum, sub) => sum + 1 + countDescendants(sub), 0);
    }

    async function handleConfirm() {
        await (new APICall(`warehouse-product-categories/${props.category.id}`, 'DELETE')).execute();
        emit('removed-category');
    }
</script>

<style lang="scss">
    .warehouse-remove-category-popup__overlay {
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

    .warehouse-remove-category-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .warehouse-remove-category-popup__warning {
        color: $fontColorError;
        font-size: 13px;
        margin-top: -10px;
    }

    .warehouse-remove-category-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .warehouse-remove-category-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
