<template>
    <aside class="warehouse-product-categories-sidebar">
        <div class="warehouse-product-categories-sidebar__header">
            <span style="font-weight: bold;">Product Categories</span>

            <TheButton
                class="warehouse-product-categories-sidebar__add-button"
                @click="router.push({ name: 'add-warehouse-product-category' })"
            >
                Add
            </TheButton>
        </div>
        <div
            v-if="categories == undefined"
            class="warehouse-product-categories-sidebar__loader"
        >
            <TheSpinner />
        </div>
        <div
            v-else
            class="warehouse-product-categories-sidebar__list"
        >
            <WarehouseProductCategoryItem
                v-if="categories.length > 0"
                v-for="category in categories"
                :key="category.id"
                :category="category"
                :level="1"
            />
            <div
                v-else
                class="warehouse-product-categories-sidebar__no-categories"
            >
                <span>No categories have been<br> added yet</span>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
    import { ref, provide } from 'vue';
    import router from '@/router';
    import type { WarehouseProductCategory } from './warehouse-product-categories-models';

    import WarehouseProductCategoryItem from './WarehouseProductCategoryItem.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    interface Props {
        categories: WarehouseProductCategory[] | undefined
    }

    const props = defineProps<Props>();

    const openChildId = ref<number | null>(null);

    provide('warehouse-product-open-child', openChildId);
</script>

<style lang="scss">
    .warehouse-product-categories-sidebar {
        display: none;
        width: 100%;
        background-color: $lightGray;
        border: 1px solid $lightGrayBorder;
        height: calc(100vh - 48px);

        @include desktop() {
            display: block;
            width: 300px;
            flex-shrink: 0;
            overflow-y: auto;
        }
    }

    .warehouse-product-categories-sidebar__loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100% - 47px);
    }

    .warehouse-product-categories-sidebar__header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        background: darkgray;
        border-bottom: 1px solid #d3d3d3;
        color: white;
    }

    .warehouse-product-categories-sidebar__add-button {
        padding: 4px 10px;
    }

    .warehouse-product-categories-sidebar__no-categories {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-weight: bold;
        text-align: center;
    }
</style>
