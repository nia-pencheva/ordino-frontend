<template>
    <div class="deactivate-supplier-popup__overlay">
        <TheWindow class="deactivate-supplier-popup__window">
            <div class="deactivate-supplier-popup__content">
                <p>Deactivate supplier <b>{{ props.supplier?.name }}</b>?</p>

                <div class="deactivate-supplier-popup__buttons">
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
    const emit = defineEmits(['close', 'deactivated-supplier'])

    async function handleConfirm() {
        await new APICall(`suppliers/${props.supplier?.id}/deactivate`, 'POST').execute()
        emit('deactivated-supplier')
    }
</script>

<style lang="scss">
    .deactivate-supplier-popup__overlay {
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

    .deactivate-supplier-popup__window {
        max-width: 300px;
    }

    .deactivate-supplier-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
        text-align: center;
    }

    .deactivate-supplier-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .deactivate-supplier-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
