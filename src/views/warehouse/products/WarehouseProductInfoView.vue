<template>
    <TheLayout>
        <div 
            v-if="warehouseProduct == undefined"
            class="warehouse-product-info-view__loader"
        >
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>{{ warehouseProduct.productName }}</TheTitle>

            <div class="warehouse-product-info-view__actions-toolbar">
                <TheButton
                    class="warehouse-product-info-view__button"
                    @click="router.push({ name: 'edit-warehouse-product', params: { id: route.params.id } })"
                >
                    Edit
                </TheButton>

                <TheButton
                    v-if="warehouseProduct?.active"
                    class="warehouse-product-info-view__button"
                    @click="deactivatePopupOpen = true"
                >
                    Deactivate
                </TheButton>

                <TheButton
                    v-else
                    class="warehouse-product-info-view__button"
                    @click="activateProduct"
                >
                    Activate
                </TheButton>
            </div>

            <div>
                <SectionTitle>Information</SectionTitle>

                <div class="warehouse-product-info-view__meta-row">
                    <span class="warehouse-product-info-view__label">Minimum quantity</span>
                    <span>{{ warehouseProduct.minQuantity }} {{ warehouseProduct.unitAbbreviation }}</span>
                </div>
            </div>

            <DeactivateWarehouseProductPopup
                v-if="deactivatePopupOpen"
                :warehouse-product="warehouseProduct"
                @close="deactivatePopupOpen = false"
                @deactivated-product="handleDeactivated"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import TheButton from '@/components/base/TheButton.vue';
import TheSpinner from '@/components/base/TheSpinner.vue';
import TheLayout from '@/components/layout/TheLayout.vue';
import TheTitle from '@/components/layout/TheTitle.vue';
import { WarehouseProduct } from '@/components/warehouse/products/warehouse-products-models';
import router from '@/router';
import { APICall } from '@/service/api/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DeactivateWarehouseProductPopup from './DeactivateWarehouseProductPopup.vue';
import SectionTitle from '@/components/base/SectionTitle.vue';

const route = useRoute();

const warehouseProduct = ref<WarehouseProduct | undefined>(undefined);
const deactivatePopupOpen = ref<boolean>(false);

async function activateProduct() {
    await (new APICall(`warehouse-products/${route.params.id}/activate`, 'POST')).execute();
    fetchWarehouseProduct();
}

async function fetchWarehouseProduct() {
    warehouseProduct.value = await (new APICall<WarehouseProduct>(`warehouse-products/${route.params.id}`)).execute();
}

async function handleDeactivated() {
    deactivatePopupOpen.value = false;
    await fetchWarehouseProduct();
}

onMounted(fetchWarehouseProduct);
</script>

<style>
    .warehouse-product-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .warehouse-product-info-view__actions-toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .warehouse-product-info-view__button {
        width: 90px;
        padding: 4px;
    }

    .warehouse-product-info-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .warehouse-product-info-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }
</style>