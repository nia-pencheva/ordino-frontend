<template>
    <TheLayout :content-styles="['edit-loss-reason-view']">
        <TheTitle>Edit Loss Reason</TheTitle>

        <br>

        <div class="edit-loss-reason-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>

        <LossReasonForm
            v-else
            :lossReason="lossReason"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { LossReason } from '@/components/warehouse/loss_reasons/loss-reasons-models';
    import { APICall } from '@/service/api/api';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import LossReasonForm from '@/components/warehouse/loss_reasons/LossReasonForm.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const lossReason = ref<LossReason | undefined>(undefined);

    const loaded = computed<boolean>(() => lossReason.value !== undefined);

    async function fetchLossReason() {
        lossReason.value = await (new APICall<LossReason>('loss-reasons/' + route.params.id)).execute();
    }

    onMounted(async () => {
        await fetchLossReason();
    });
</script>

<style lang="scss">
    .edit-loss-reason-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-loss-reason-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
