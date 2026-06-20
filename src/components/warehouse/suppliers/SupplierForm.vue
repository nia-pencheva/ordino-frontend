<template>
    <TheForm class="supplier-form">
        <FormElement
            id="name"
            :errors="errors?.getByField('name')"
        >
            <template #label>Name</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="name"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Name"
                />
            </template>
        </FormElement>

        <FormElement
            id="address"
            :errors="errors?.getByField('address')"
        >
            <template #label>Address</template>
            <template #default="defaultProps">
                <TextArea
                    v-model="address"
                    :id="defaultProps.id"
                    placeholder="Address"
                    rows="3"
                />
            </template>
        </FormElement>

        <FormElement
            id="email"
            :errors="errors?.getByField('email')"
        >
            <template #label>Email</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="email"
                    :id="defaultProps.id"
                    type="email"
                    placeholder="Email"
                />
            </template>
        </FormElement>

        <FormElement
            id="phoneNumber"
            :errors="errors?.getByField('phoneNumber')"
        >
            <template #label>Phone number</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="phoneNumber"
                    :id="defaultProps.id"
                    type="tel"
                    placeholder="+35912345678"
                />
            </template>
        </FormElement>

        <br />

        <div class="supplier-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit"
                class="supplier-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'supplier-form__button-label--hidden': submitting }">
                    <span v-if="route.name === 'add-supplier'">Add</span>
                    <span v-if="route.name === 'edit-supplier'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="supplier-form__spinner" />
            </TheButton>

            <TheButton
                @click="router.back()"
                class="supplier-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'
    import { Supplier } from './suppliers-models'

    import TextInput from '@/components/base/TextInput.vue'
    import TextArea from '@/components/base/TextArea.vue'
    import FormElement from '@/components/base/form/FormElement.vue'
    import TheForm from '@/components/base/form/TheForm.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'

    const route = useRoute()
    const router = useRouter()

    interface Props {
        supplier?: Supplier
    }

    const props = defineProps<Props>()

    const name = ref<string>(props.supplier?.name ?? '')
    const address = ref<string>(props.supplier?.address ?? '')
    const email = ref<string>(props.supplier?.email ?? '')
    const phoneNumber = ref<string>(props.supplier?.phoneNumber ?? '')
    const errors = ref<UnprocessableContentError | undefined>(undefined)
    const submitting = ref<boolean>(false)

    async function handleSubmit() {
        submitting.value = true

        try {
            const data = {
                name: name.value.trim(),
                address: address.value.trim(),
                email: email.value.trim(),
                phoneNumber: phoneNumber.value.trim()
            }

            if (route.name === 'add-supplier') {
                await new APICall('suppliers/add', 'POST', data).execute()
                router.replace({ name: 'suppliers' })
            } else {
                await new APICall(`suppliers/${route.params.id}`, 'POST', data).execute()
                router.replace({ name: 'supplier-info', params: { id: route.params.id } })
            }
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error
            }
        } finally {
            submitting.value = false
        }
    }
</script>

<style lang="scss">
    .supplier-form {
        max-width: 350px;
        width: 100%;
    }

    .supplier-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .supplier-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .supplier-form__button-label--hidden {
        visibility: hidden;
    }

    .supplier-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
