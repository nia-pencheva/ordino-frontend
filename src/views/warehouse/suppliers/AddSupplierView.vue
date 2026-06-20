<template>
    <TheLayout :content-styles="['add-supplier-view']">
        <TheTitle>Add supplier</TheTitle>

        <SupplierForm />
    </TheLayout>
</template>

<script setup lang="ts">
    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import SupplierForm from '@/components/warehouse/suppliers/SupplierForm.vue'
</script>

<style lang="scss">
    .add-supplier-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
