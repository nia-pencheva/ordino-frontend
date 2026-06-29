<template>
    <TheForm class="loss-reason-form">
        <FormElement
            id="reason"
            :errors="errors?.getByField('reason')"
        >
            <template #label>Reason</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="reason"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Reason"
                />
            </template>
        </FormElement>

        <br />

        <div class="loss-reason-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()"
                class="loss-reason-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'loss-reason-form__button-label--hidden': submitting }">
                    <span v-if="route.name == 'add-loss-reason'">Add</span>
                    <span v-if="route.name == 'edit-loss-reason'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="loss-reason-form__spinner" />
            </TheButton>

            <TheButton
                @click="router.back()"
                class="loss-reason-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { LossReason } from './loss-reasons-models';
    import { useRoute, useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';

    import TextInput from '@/components/base/TextInput.vue';
    import FormElement from '@/components/base/form/FormElement.vue';
    import TheForm from '@/components/base/form/TheForm.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();
    const router = useRouter();

    interface Props {
        lossReason?: LossReason
    }

    const props = defineProps<Props>();

    const reason = ref<string>(props.lossReason?.reason ?? '');
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = { reason: reason.value.trim() };

            if (route.name == 'add-loss-reason') {
                await addLossReason(data);
            } else {
                await editLossReason(data);
            }
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addLossReason(data: Record<string, unknown>) {
        await (new APICall('loss-reasons', 'POST', data)).execute();
        router.back();
    }

    async function editLossReason(data: Record<string, unknown>) {
        await (new APICall('loss-reasons/' + props.lossReason?.id, 'POST', data)).execute();
        router.back();
    }
</script>

<style lang="scss">
    .loss-reason-form {
        max-width: 350px;
        width: 100%;
    }

    .loss-reason-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .loss-reason-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .loss-reason-form__button-label--hidden {
        visibility: hidden;
    }

    .loss-reason-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
