<template>
    <TheLayout :content-styles="['edit-unit-view']">
        <TheTitle>Edit unit</TheTitle>

        <br>

        <div class="edit-unit-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>

        <UnitForm
            v-else
            :unit="unit"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { EditUnitResponse } from '@/components/units/units-models';
    import { useRoute } from 'vue-router';
    import { APICall } from '@/service/api/api';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import UnitForm from '@/components/units/UnitForm.vue';

    const route = useRoute();

    const unit = ref<EditUnitResponse | undefined>(undefined);

    const loaded = computed<boolean>(() => unit.value !== undefined);

    async function fetchUnit() {
        unit.value = await (new APICall<EditUnitResponse>('units/' + route.params.id)).execute();
    }

    onMounted(async () => {
        await fetchUnit();
    });
</script>

<style lang="scss">
    .edit-unit-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-unit-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
