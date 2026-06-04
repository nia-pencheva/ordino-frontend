<template>
    <TheForm
        class="login-form"
        @enter-pressed="handleLogin"
    >
        <FormElement
            id="username"
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
            id="password"
        >
            <template #label>Password</template>
            <template #default="defaultProps">
                <TextInput 
                    v-model="password"
                    :id="defaultProps.id"
                    type="password"
                    placeholder="Password"
                />
            </template>
        </FormElement>

        <p 
            v-if="hasLoginError"
            class="login-form__wrong-credentials"    
        >
            {{ loginError }}
        </p>

        <TheButton 
            @click="handleLogin"
            class="login-form__button"
        >
            Login
        </TheButton>
    </TheForm>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { useAuth } from '@/store/auth/auth';
    import { computed, ref } from 'vue';

    import TheButton from '../base/TheButton.vue';
    import TextInput from '../base/TextInput.vue';
    import TheForm from '../base/form/TheForm.vue';
    import FormElement from '../base/form/FormElement.vue';

    const auth = useAuth();

    const username = ref<string>("");
    const password = ref<string>("");
    const loginError = ref<string>("");

    const hasLoginError = computed<boolean>(() => loginError.value != "");

    async function handleLogin() {
        try {
            if(username.value.trim() != "" && password.value.trim() != "") {
                await auth.login({
                    username: username.value.trim(),
                    password: password.value.trim()
                });
                
                router.replace({ name: 'home' });   
            }
        }
        catch(error: any) {
            switch(error.message) {
                case "INVALID_CREDENTIALS":
                    loginError.value = "Wrong credentials"
                    break;
                case "PASSWORD_CHANGE_REQUIRED":
                    router.replace({ name: 'change-password' });
            }
        }
    }
</script>

<style lang="scss">
    .login-form {
        width: 100%; 
        max-width: 300px;
    }

    .login-form__fields {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        width: 100%;
        margin: 20px 0px;
    }

    .login-form__field__wrapper {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .login-form__wrong-credentials {
        color: $fontColorError;
    }

    .login-form__button {
        width: 75px;
        padding: 4px 18px;
    }
</style>