<template>
    <TheLayout :content-styles="['add-loss-reason-view']">
        <TheTitle>Add Loss Reason</TheTitle>

        <LossReasonForm />
    </TheLayout>
</template>

<script setup lang="ts">
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import LossReasonForm from '@/components/warehouse/loss_reasons/LossReasonForm.vue';
</script>

<style lang="scss">
    .add-loss-reason-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
