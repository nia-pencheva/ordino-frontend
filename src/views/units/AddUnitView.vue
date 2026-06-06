<template>
    <TheLayout :content-styles="['add-unit-view']">
        <TheTitle>Add unit to category {{ route.query.categoryName }}</TheTitle>

        <UnitForm />
    </TheLayout>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UnitForm from '@/components/units/UnitForm.vue';

    const route = useRoute();
</script>

<style lang="scss">
    .add-unit-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
