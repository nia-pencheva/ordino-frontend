<template>
    <TheWindow style="width: 100%; max-width: 400px;">
        <div class="login-form">
            <h2>Login</h2>

            <div class="login-form__fields">
                <div class="login-form__field__wrapper">
                    <label for="username">Username</label>
                    <TextInput 
                        v-model="username"
                        id="username"
                        type="text"
                        placeholder="Username"
                    />
                </div>

                <div class="login-form__field__wrapper">
                    <label for="password">Password</label>
                    <TextInput 
                        v-model="password"
                        id="password"
                        type="password"
                        placeholder="Password"
                    />
                </div>
            </div>

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
        </div>
    </TheWindow>
</template>

<script setup lang="ts">
    // Imports
    import router from '@/router';
    import { useAuth } from '@/store/auth/auth';
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import { UnauthorizedError } from '@/service/api/models/response-errors';

    // Components
    import TheWindow from '../base/TheWindow.vue';
    import TheButton from '../base/TheButton.vue';
    import TextInput from '../base/TextInput.vue';

    // Vars
    let enterEventListener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    // Store
    const auth = useAuth();

    // Refs
    const username = ref<string>("");
    const password = ref<string>("");
    const loginError = ref<string>("");

    // Computed
    const hasLoginError = computed<boolean>(() => loginError.value != "");

    // Functions
    async function handleLogin() {
        try {
            auth.login({
                    username: username.value,
                    password: password.value
                })
                .then(() => router.replace('/'));
        }
        catch(error: any) {
            if(error instanceof UnauthorizedError) {
                loginError.value = "Wrong credentials";
            }
        }
    }

    // Lifecycle hooks
    onMounted(() => {
        document.addEventListener('keydown', enterEventListener);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', enterEventListener);
    });
</script>

<style lang="scss">
    .login-form {
        display: flex;
        flex-direction: column;
        align-items: center;
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
        margin: 0px 0px 20px;
        color: $fontColorError;
    }

    .login-form__button {
        width: 75px;
        padding: 4px 18px;
    }
</style>