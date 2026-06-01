<template>
     <TheForm
        @enter-pressed="handleSubmit"
        class="change-password-form"
     >
        <FormElement 
            id="new-password"

        >
            <template #label>New Password</template>
            <template #default="defaultProps">
                <TextInput 
                    v-model="newPassword"
                    :id="defaultProps.id"
                    type="password"
                    placeholder="New Password"
                />
            </template>
        </FormElement>

         <FormElement 
            id="confirm-password"

        >
            <template #label>Confirm Password</template>
            <template #default="defaultProps">
                <TextInput 
                    v-model="confirmPassword"
                    :id="defaultProps.id"
                    type="password"
                    placeholder="Confirm Password"
                />
            </template>
        </FormElement>

        <ul 
            v-if="hasErrors"
            class="change-passsword-form__errors"    
        >
            <li v-for="error in errors">
                {{ error.message }}
            </li>
        </ul>

        <TheButton
            @click="handleSubmit"
            class="change-password-form__submit"
        >
            Submit
        </TheButton>
    </TheForm>
</template>

<script setup lang="ts">
    // Imports
    import router from '@/router';
    import { APICall } from '@/service/api/api';
    import { computed, ref } from 'vue';
    import { useAuth } from '@/store/auth/auth';
    import { UnprocessableContentError, ValidationError } from '@/service/api/models/response-errors';

    // Components
    import FormElement from '@/components/base/form/FormElement.vue';
    import TheForm from '@/components/base/form/TheForm.vue';
    import TextInput from '@/components/base/TextInput.vue';
    import TheButton from '../base/TheButton.vue';

    // Store
    const auth = useAuth();

    // Refs
    const newPassword = ref<string>("");
    const confirmPassword = ref<string>("");
    const errors = ref<ValidationError[]>([]);

    // Computed
    const hasErrors = computed<boolean>(() => {
        return errors.value != undefined && errors.value?.length !== 0 
    });

    // Functions
    async function handleSubmit() {
        try {
            if(newPassword.value.trim() != "" && confirmPassword.value.trim() != "") {
                await (new APICall<void>("change-password", "POST", {
                    newPassword: newPassword.value.trim(),
                    confirmPassword: confirmPassword.value.trim()
                })).execute();

                auth.markPasswordChanged();
                router.replace({ name: 'home' });
            }
        }
        catch(error: any) {
            if(error instanceof UnprocessableContentError) {
                errors.value = error.errors; 
            }
        }
    }
</script>

<style lang="scss">
    .change-password-form {
        width: 100%;
        max-width: 300px;
    }

    .change-password-form__submit {
        width: 75px;
        padding: 4px;
    }

    .change-passsword-form__errors {
        color: $fontColorError;
        font-size: 12px;
        text-align: justify;
    }
</style>