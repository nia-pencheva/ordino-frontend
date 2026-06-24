<template>
    <TheLayout>
        <TheTitle>Loss Reasons</TheTitle>

        <div class="loss-reasons-view__toolbar">
            <TheButton
                @click="router.push({ name: 'add-loss-reason' })"
                class="loss-reasons-view__add-button"
            >
                Add
            </TheButton>
        </div>

        <div class="loss-reasons-view__wrapper">
            <div
                v-if="!loaded"
                class="loss-reasons-view__loader"
            >
                <TheSpinner size="lg" />
            </div>
            <template v-else>
                <div
                    v-if="lossReasonsPage?.totalElements != 0"
                    class="loss-reasons-view__results"
                >
                    <LossReasonsTable
                        :lossReasons="lossReasonsPage?.lossReasons"
                        @delete="openDeletePopup"
                    />

                    <ThePager
                        v-if="(lossReasonsPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="lossReasonsPage?.totalPages"
                        @previous="getPreviousPage()"
                        @next="getNextPage()"
                    />
                </div>

                <div
                    v-else
                    class="loss-reasons-view__no-results"
                >
                    <p>No loss reasons found</p>
                </div>
            </template>
        </div>

        <DeleteLossReasonPopup
            v-if="lossReasonToDelete"
            :lossReason="lossReasonToDelete"
            @close="lossReasonToDelete = undefined"
            @deleted="onDeleted"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { LossReason, LossReasonsPage } from '@/components/warehouse/loss_reasons/loss-reasons-models';
    import { APICall } from '@/service/api/api';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import LossReasonsTable from '@/components/warehouse/loss_reasons/LossReasonsTable.vue';
    import DeleteLossReasonPopup from '@/components/warehouse/loss_reasons/DeleteLossReasonPopup.vue';

    const router = useRouter();

    const pageSize = 10;

    const lossReasonsPage = ref<LossReasonsPage | undefined>(undefined);
    const currentPage = ref<number>(1);
    const lossReasonToDelete = ref<LossReason | undefined>(undefined);

    const loaded = computed<boolean>(() => lossReasonsPage.value != undefined);

    async function fetchLossReasons() {
        lossReasonsPage.value = await (new APICall<LossReasonsPage>(`loss-reasons?page=${currentPage.value}&pageSize=${pageSize}`)).execute();

        if ((lossReasonsPage.value?.totalElements ?? 0) > 0 && lossReasonsPage.value?.lossReasons.length == 0) {
            getPreviousPage();
        }
    }

    async function getNextPage() {
        currentPage.value++;
        lossReasonsPage.value = undefined;
        await fetchLossReasons();
    }

    async function getPreviousPage() {
        currentPage.value--;
        lossReasonsPage.value = undefined;
        await fetchLossReasons();
    }

    function openDeletePopup(lossReason: LossReason) {
        lossReasonToDelete.value = lossReason;
    }

    async function onDeleted() {
        lossReasonToDelete.value = undefined;
        lossReasonsPage.value = undefined;
        await fetchLossReasons();
    }

    onMounted(async () => {
        await fetchLossReasons();
    });
</script>

<style lang="scss">
    .loss-reasons-view__toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 20px;
    }

    .loss-reasons-view__add-button {
        width: 75px;
        padding: 4px;
    }

    .loss-reasons-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loss-reasons-view__wrapper {
        flex: 1;
        display: flex;
    }

    .loss-reasons-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .loss-reasons-view__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
