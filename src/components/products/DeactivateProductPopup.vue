<template>
    <div class="deactivate-product-popup__overlay">
        <TheWindow>
            <div class="deactivate-product-popup__content">
                <p>Deactivate product <b>{{ props.product.name }}</b>?</p>

                <div class="deactivate-product-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { Product } from './products-models';

    import TheWindow from '../base/TheWindow.vue';
    import TheButton from '../base/TheButton.vue';

    interface Props {
        product: Product
    }

    const props = defineProps<Props>();
    const emit = defineEmits(['close', 'deactivated-product']);

    async function handleConfirm() {
        await (new APICall(`products/${props.product.id}/deactivate`, 'POST')).execute();
        emit('deactivated-product');
    }
</script>

<style lang="scss">
    .deactivate-product-popup__overlay {
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

    .deactivate-product-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .deactivate-product-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .deactivate-product-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
