<template>
    <TheLayout :content-styles="[ 'edit-unit-category-view' ]">
        <TheTitle>Edit unit category</TheTitle>

        <br>

        <div class="edit-unit-category-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>

        <UnitCategoryForm 
            v-else
            :unit-category="unitCategory"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { UnitCategoryForEditing } from '@/components/units/units-models';
    import { useRoute } from 'vue-router';
    import { APICall } from '@/service/api/api';

    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UnitCategoryForm from '@/components/units/UnitCategoryForm.vue';

    const route = useRoute();

    const unitCategory = ref<UnitCategoryForEditing | undefined>(undefined);

    const loaded = computed<boolean>(() => unitCategory.value !== undefined);

    async function fetchUnit() {
        unitCategory.value = await (new APICall<UnitCategoryForEditing>('unit-categories/' + route.params.id)).execute();
    }

    onMounted(async () => {
        await fetchUnit();
    });
</script>

<style lang="scss">
    .edit-unit-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-unit-category-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>