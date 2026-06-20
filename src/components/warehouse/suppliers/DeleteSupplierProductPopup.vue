<template>
    <div class="delete-supplier-product-popup__overlay">
        <TheWindow class="delete-supplier-product-popup__window">
            <div class="delete-supplier-product-popup__content">
                <p>Delete <b>{{ props.supplierProduct?.productName }}</b> from this supplier's catalog?</p>

                <div class="delete-supplier-product-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api'
    import { SupplierProduct } from './suppliers-models'

    import TheWindow from '@/components/base/TheWindow.vue'
    import TheButton from '@/components/base/TheButton.vue'

    interface Props {
        supplierProduct?: SupplierProduct
        supplierId?: number | string
    }

    const props = defineProps<Props>()
    const emit = defineEmits(['close', 'deleted'])

    async function handleConfirm() {
        await new APICall(`suppliers/${props.supplierId}/products/${props.supplierProduct?.id}`, 'DELETE').execute()
        emit('deleted')
    }
</script>

<style lang="scss">
    .delete-supplier-product-popup__overlay {
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

    .delete-supplier-product-popup__window {
        max-width: 350px;
    }

    .delete-supplier-product-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
        text-align: center;
    }

    .delete-supplier-product-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-supplier-product-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
