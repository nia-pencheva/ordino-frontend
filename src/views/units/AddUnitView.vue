<template>
    <TheLayout :content-styles="['add-unit-view']">
        <TheTitle>Add unit</TheTitle>

        <UnitForm />
    </TheLayout>
</template>

<script setup lang="ts">
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UnitForm from '@/components/units/UnitForm.vue';
</script>

<style lang="scss">
    .add-unit-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
