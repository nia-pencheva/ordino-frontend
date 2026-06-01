<template>
    <div class="reset-password-popup__overlay">
        <TheWindow v-if="newPassword == undefined">
            <div class="reset-password-popup__content">
                <p>Reset password for user <b>{{ username }}</b>?</p>

                <div class="reset-password-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>

        <TheWindow v-else>
            <div class="reset-password-popup__password-content">
                <p style="text-align: center;">
                    <b>New password</b> for
                    <br><br>
                    <b>{{ username }}</b>:
                    <br><br>
                    {{ newPassword }}
                </p>

                <br>

                <TheButton
                    @click="emit('close')"
                    class="reset-password-popup__close"
                    type="important"
                >
                    Close
                </TheButton>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { APICall } from '@/service/api/api';
    import { ResetPasswordResponse } from './users-models';

    import TheWindow from '../base/TheWindow.vue';
    import TheButton from '../base/TheButton.vue';

    interface Props {
        userId: Number
        username: string
    }

    const props = defineProps<Props>();
    const emit = defineEmits(['close']);

    const newPassword = ref<string | undefined>(undefined);

    async function handleConfirm() {
        const response = await (new APICall<ResetPasswordResponse>(`users/${props.userId}/reset-password`, 'POST')).execute();
        newPassword.value = response.newPassword;
    }
</script>

<style lang="scss">
    .reset-password-popup__overlay {
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

    .reset-password-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .reset-password-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .reset-password-popup__buttons .the-button {
        padding: 4px 12px;
    }

    .reset-password-popup__password-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
    }

    .reset-password-popup__close {
        width: 75px;
        padding: 4px;
    }
</style>
