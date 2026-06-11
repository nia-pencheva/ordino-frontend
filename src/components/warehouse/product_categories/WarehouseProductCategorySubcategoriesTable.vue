<template>
    <div class="warehouse-product-categories-subcategories__table-and-pager-wrapper">
        <div class="warehouse-product-categories-subcategories-table">
            <WarehouseProductCategorySubcategoryRow
                v-for="subCategory in pagedSubCategories"
                :key="subCategory.id"
                :sub-category="subCategory"
                :parent-category="props.parentCategory"
            />
        </div>
        <ThePager
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @previous="previousPage"
            @next="nextPage"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, inject, Ref } from 'vue';
    import type { WarehouseProductCategory } from './warehouse-product-categories-models';

    import WarehouseProductCategorySubcategoryRow from './WarehouseProductCategorySubcategoryRow.vue';
    import ThePager from '@/components/base/ThePager.vue';

    interface Props {
        subCategories: WarehouseProductCategory[]
        parentCategory?: WarehouseProductCategory
    }

    const props = defineProps<Props>();

    const currentPage = inject<Ref<number>>("currentPage")!;
    const nextPage = inject<() => void>("nextPage");
    const previousPage = inject<() => void>("previousPage");

    const pageSize = 10;

    const totalPages = computed(() => Math.ceil(props.subCategories.length / pageSize));

    const pagedSubCategories = computed(() =>
        props.subCategories.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
    );
</script>

<style lang="scss">
    .warehouse-product-categories-subcategories__table-and-pager-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .warehouse-product-categories-subcategories-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
