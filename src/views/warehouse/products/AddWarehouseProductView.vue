<template>
    <TheLayout :content-styles="['add-warehouse-product-view']">
        <div
            v-if="product === undefined"
            class="add-warehouse-product-view__loader"
        >
            <TheSpinner size="lg" />
        </div>
        <template v-else>
            <TheTitle>Add {{ product.name }} to warehouse</TheTitle>

            <WarehouseProductForm
                :submitting="submitting"
                :validation-errors="validationErrors"
                @submit="handleSubmit"
                @cancel="router.push({ name: 'warehouse-products' })"
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

    import { Product } from '@/components/products/products-models';

    const route = useRoute();
    const router = useRouter();

    const product = ref<Product | undefined>(undefined);
    const submitting = ref<boolean>(false);
    const validationErrors = ref<UnprocessableContentError | undefined>(undefined);

    async function handleSubmit({ unitId, minQuantity }: { unitId: number | null; minQuantity: number | undefined }) {
        submitting.value = true;
        validationErrors.value = undefined;

        try {
            await (new APICall('warehouse-products/add-product', 'POST', {
                productId: parseInt(route.params.id as string),
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
        product.value = await (new APICall<Product>(`products/${route.params.id}`)).execute();
    });
</script>

<style lang="scss">
    .add-warehouse-product-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .add-warehouse-product-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
