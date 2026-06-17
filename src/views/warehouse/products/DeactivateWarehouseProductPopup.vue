<template>
    <div class="deactivate-warehouse-product-popup__overlay">
        <TheWindow class="deactivate-warehouse-product-popup__window">
            <div class="deactivate-warehouse-product-popup__content">
                <template v-if="props.warehouseProduct.deactivateForbiddenReasons.length === 0">
                    <p>Deactivate warehouse product <b>{{ props.warehouseProduct.productName }}</b>?</p>

                    <div class="deactivate-warehouse-product-popup__buttons">
                        <TheButton 
                            @click="handleConfirm"
                            class="deactivate-warehouse-product-popup__button"    
                        >
                            Confirm
                        </TheButton>

                        <TheButton 
                            type="important" 
                            @click="emit('close')"
                            class="deactivate-warehouse-product-popup__button"    
                        >
                            Cancel
                        </TheButton>
                    </div>
                </template>
                <template v-else>
                    <p><b>Deactivate forbidden</b></p>
                    <div>
                        <div 
                            v-for="reason in warehouseProduct.deactivateForbiddenReasons" 
                            :key="reason" 
                        >
                            {{ reason }}
                        </div>
                    </div>
                    <TheButton 
                        type="important" 
                        @click="emit('close')"
                        class="deactivate-warehouse-product-popup__button"
                    >
                        Close
                    </TheButton>
                </template>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { WarehouseProduct } from '@/components/warehouse/products/warehouse-products-models';
    import { useRoute } from 'vue-router';
import TheWindow from '@/components/base/TheWindow.vue';
import TheButton from '@/components/base/TheButton.vue';

    const route = useRoute();
    interface Props {
        warehouseProduct: WarehouseProduct
    }

    const props = defineProps<Props>();
    const emit = defineEmits(['close', 'deactivated-product']);

    async function handleConfirm() {
        await (new APICall(`warehouse-products/${route.params.id}/deactivate`, 'POST')).execute();
        emit('deactivated-product');
    }
</script>

<style lang="scss">
    .deactivate-warehouse-product-popup__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .deactivate-warehouse-product-popup__window {
        max-width: 300px;
    }

    .deactivate-warehouse-product-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
        text-align: center;
    }
    
    .deactivate-warehouse-product-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .deactivate-warehouse-product-popup__button {
        padding: 4px 12px;
    }
</style>
