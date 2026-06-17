<template>
    <TheLayout :content-styles="['edit-warehouse-product-view']">
        <div
            v-if="warehouseProduct === undefined"
            class="edit-warehouse-product-view__loader"
        >
            <TheSpinner size="lg" />
        </div>
        <template v-else>
            <TheTitle>Edit {{ warehouseProduct.productName }}</TheTitle>

            <WarehouseProductForm
                :initial-unit-id="warehouseProduct.unitId"
                :initial-min-quantity="warehouseProduct.minQuantity"
                mode="edit"
                :submitting="submitting"
                :validation-errors="validationErrors"
                @submit="handleSubmit"
                @cancel="router.back()"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import WarehouseProductForm from '@/components/warehouse/products/WarehouseProductForm.vue';

    import { WarehouseProduct } from '@/components/warehouse/products/warehouse-products-models';

    const route = useRoute();
    const router = useRouter();

    const warehouseProduct = ref<WarehouseProduct | undefined>(undefined);
    const submitting = ref<boolean>(false);
    const validationErrors = ref<UnprocessableContentError | undefined>(undefined);

    async function handleSubmit({ unitId, minQuantity }: { unitId: number | null; minQuantity: number | undefined }) {
        submitting.value = true;
        validationErrors.value = undefined;

        try {
            await (new APICall(`warehouse-products/${route.params.id}`, 'POST', {
                unitId,
                minQuantity
            })).execute();

            router.replace({ name: 'warehouse-products' });
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                validationErrors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    onMounted(async () => {
        warehouseProduct.value = await (new APICall<WarehouseProduct>(`warehouse-products/${route.params.id}`)).execute();
    });
</script>

<style lang="scss">
    .edit-warehouse-product-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-warehouse-product-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
