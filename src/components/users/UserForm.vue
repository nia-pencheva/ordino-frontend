<template>
    <TheForm 
        v-if="initialPassword == undefined"
        class="user-form"
    >
        <FormElement 
            id="username"
            :errors="errors?.getByField('username')"
        >
            <template #label>Username</template>
            <template #default="defaultProps">
                <TextInput 
                    v-model="username"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Username"
                />
            </template>
        </FormElement>

        <FormElement 
            id="full-name"
            :errors="errors?.getByField('fullName')"    
        >
            <template #label>Full Name</template>
            <template #default="defaultProps">
                <TextInput 
                    v-model="fullName"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Full Name"
                />
            </template>
        </FormElement>

        <FormElement 
            id="phone-number"
            :errors="errors?.getByField('phoneNumber')"     
        >
            <template #label>Phone Number</template>
            <template #default="defaultProps">
                 <TextInput 
                    v-model="phoneNumber"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Phone Number"
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
                    type="text"
                    placeholder="Email"
                />
            </template>
        </FormElement>

        <FormElement 
            id="roles"
            :errors="errors?.getByField('roles')"     
        >
            <template #label>Roles</template>
            <template #default="defaultProps">
                <div 
                    :id="defaultProps.id" 
                    class="user-form__roles"
                >
                    <TheCheckbox
                        v-for="role of Object.values(Role)"
                        :key="role"
                        v-model="roles"
                        :value="role"
                        :disabled="role == 'admin' && disableAdminRole"
                    >
                        {{ role }}
                    </TheCheckbox>
                </div>
            </template>
        </FormElement>

        <br />

        <div class="user-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()" 
                class="user-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'user-form__button-label--hidden': submitting }">
                    <span v-if="route.name == 'add-user'">Add</span>
                    <span v-if="route.name == 'edit-user'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="user-form__spinner" />
            </TheButton>

            <TheButton
                @click="router.back()"
                class="user-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
        
    </TheForm>

    <TheWindow v-else>
        <div class="user-form__initial-password-popup__content">
            <p style="text-align: center;">
                <b>Initial password</b> for 
                <br><br>
                <b>{{ username }}</b>: 
                <br><br>
                {{ initialPassword }}
            </p>

            <br>

            <TheButton 
                @click="router.replace({ name: 'users' })"
                class="user-form__initial-password-popup__close"
                type="important"
            >
                Close
            </TheButton>
        </div>
    </TheWindow>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { User, Role, AddUserResponse } from './users-models';
    import { useRoute, useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';
    import { useAuth } from '@/store/auth/auth';

    import TextInput from '../base/TextInput.vue';
    import FormElement from '../base/form/FormElement.vue';
    import TheForm from '../base/form/TheForm.vue';
    import TheCheckbox from '../base/TheCheckbox.vue';
    import TheButton from '../base/TheButton.vue';
    import TheWindow from '../base/TheWindow.vue';
    import TheSpinner from '../base/TheSpinner.vue';
    
    const route = useRoute();
    const router = useRouter();

    const auth = useAuth();

    interface Props {
        user?: User
    }

    const props = defineProps<Props>();

    const username = ref<string>(props.user?.username ?? "");
    const fullName = ref<string>(props.user?.fullName ?? "");
    const phoneNumber = ref<string>(props.user?.phoneNumber ?? "");
    const email = ref<string>(props.user?.email ?? "");
    const roles = ref<string[]>(props.user?.roles ?? []);
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const initialPassword = ref<string | undefined>(undefined);
    const submitting = ref<boolean>(false);

    const disableAdminRole = computed<boolean>(() => {
        return (auth.user?.username == props.user?.username && auth.user?.hasRoles([ Role.ADMIN ])) ?? false;
    });

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = {
                username: username.value.trim(),
                fullName: fullName.value.trim(),
                phoneNumber: phoneNumber.value.trim(),
                email: email.value.trim(),
                roles: roles.value
            };

            if(route.name == 'add-user') {
                await addUser(data);
            }
            else {
                await editUser(data);
            }
        }
        catch(error: any) {
            if(error instanceof UnprocessableContentError) {
                errors.value = error; 
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addUser(data: Record<string, unknown>) {
        const response = await (new APICall<AddUserResponse>("users", "POST", data)).execute();

        initialPassword.value = response.initialPassword;
    }

    async function editUser(data: Record<string, unknown>) {
        await (new APICall("users/" + props.user?.id, "POST", data)).execute();

        router.replace({ name: 'users' });
    }
</script>

<style lang="scss">
    .user-form {
        max-width: 500px;
    }

    .user-form__roles {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 5px;
        background-color: white;
        border: 5px;
        border-radius: 5px;
        padding: 10px;
        box-shadow: 
            inset 0 1px 3px rgba(0, 0, 0, 0.2), 
            inset 0 1px 1px rgba(0, 0, 0, 0.12), 
            inset 1px 0 2px rgba(0, 0, 0, 0.06), 
            0 1px 0 rgba(255, 255, 255, 0.8);
        text-transform: capitalize;
    }

    .user-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .user-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .user-form__button-label--hidden {
        visibility: hidden;
    }

    .user-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .user-form__initial-password-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
    }

    .user-form__initial-password-popup__close {
        width: 75px;
        padding: 4px;
    }
</style>