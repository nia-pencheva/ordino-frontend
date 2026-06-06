<template>
    <TheLayout :content-styles="[ 'add-unit-category-view' ]">
        <TheTitle>Add unit category</TheTitle>

        <UnitCategoryForm />
    </TheLayout>
</template>

<script setup lang="ts">
import TheLayout from '@/components/layout/TheLayout.vue';
import TheTitle from '@/components/layout/TheTitle.vue';
import UnitCategoryForm from '@/components/units/UnitCategoryForm.vue';

</script>

<style lang="scss">
    .add-unit-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>