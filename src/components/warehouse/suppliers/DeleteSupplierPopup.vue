<template>
    <div class="delete-supplier-popup__overlay">
        <TheWindow class="delete-supplier-popup__window">
            <div class="delete-supplier-popup__content">
                <p>Delete supplier <b>{{ props.supplier?.name }}</b>?</p>

                <div class="delete-supplier-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api'
    import { Supplier } from './suppliers-models'

    import TheWindow from '@/components/base/TheWindow.vue'
    import TheButton from '@/components/base/TheButton.vue'

    interface Props {
        supplier?: Supplier
    }

    const props = defineProps<Props>()
    const emit = defineEmits(['close', 'deleted-supplier'])

    async function handleConfirm() {
        await new APICall(`suppliers/${props.supplier?.id}`, 'DELETE').execute()
        emit('deleted-supplier')
    }
</script>

<style lang="scss">
    .delete-supplier-popup__overlay {
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

    .delete-supplier-popup__window {
        max-width: 300px;
    }

    .delete-supplier-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
        text-align: center;
    }

    .delete-supplier-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-supplier-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
