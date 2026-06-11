<template>
    <TheLayout>
        <div 
            v-if="product == undefined"
            class="product-info-view__loader"
        >
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>{{ product.name }}</TheTitle>

            <div class="product-info__actions-toolbar">
                <TheButton
                    class="product-info__button"
                    @click="router.push('/products/' + product.id + '/edit')"
                >
                    Edit
                </TheButton>

                <TheButton
                    v-if="product?.active"
                    class="product-info__button"
                    :disabled="product.deactivateForbiddenReasons.length > 0"
                    :tooltip="product.deactivateForbiddenReasons"
                    @click="deactivatePopupOpen = true"
                >
                    Deactivate
                </TheButton>

                <TheButton
                    v-else
                    class="product-info__button"
                    @click="activateProduct"
                >
                    Activate
                </TheButton>

                <TheButton
                    class="product-info__button"
                    type="important"
                    :disabled="product.deleteForbiddenReasons.length > 0"
                    :tooltip="product.deleteForbiddenReasons"
                    @click="deletePopupOpen = true"
                >
                    Delete
                </TheButton>
            </div>

            <div>
                <SectionTitle>Information</SectionTitle>
                <p style="margin-bottom: 8px;">
                    <b>Notes</b>:
                </p> 
                <p>{{ product.notes ?? "Not available" }}</p>
            </div>

            <DeactivateProductPopup
                v-if="deactivatePopupOpen"
                :product="product"
                @close="deactivatePopupOpen = false"
                @deactivated-product="handleDeactivated"
            />

            <DeleteProductPopup
                v-if="deletePopupOpen"
                :product="product"
                @close="deletePopupOpen = false"
                @deleted-product="router.back()"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import router from '@/router';
    import { onMounted, ref } from 'vue';
    import { Product } from '@/components/products/products-models';
    import { useRoute } from 'vue-router';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import DeleteProductPopup from '@/components/products/DeleteProductPopup.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import DeactivateProductPopup from '@/components/products/DeactivateProductPopup.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import SectionTitle from '@/components/base/SectionTitle.vue';

    const route = useRoute();

    const product = ref<Product | undefined>(undefined);
    const deactivatePopupOpen = ref<boolean>(false);
    const deletePopupOpen = ref<boolean>(false);

    async function activateProduct() {
        await (new APICall(`products/${product.value?.id}/activate`, 'POST')).execute();
        fetchProduct();
    }

    async function fetchProduct() {
        product.value = await (new APICall<Product>(`products/${route.params.id}`)).execute();
    }

    async function handleDeactivated() {
        deactivatePopupOpen.value = false;
        await fetchProduct();
    }

    onMounted(async () => {
        fetchProduct();
    });
</script>

<style>
    .product-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .product-info__actions-toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .product-info__button {
        width: 90px;
        padding: 4px;
    }
</style>
