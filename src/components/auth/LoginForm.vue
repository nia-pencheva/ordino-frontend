<template>
    <form @submit.prevent="handleSubmit()">
        <h3>Login</h3>

        <div>
            <label>Username</label>
            <input 
                v-model="username"
                type="username" 
                placeholder="Username" 
            />
        </div>

        <div>
            <label>Password</label>
            <input 
                v-model="password"
                type="password" 
                placeholder="Password" 
            />
        </div>

        <button>Login</button>
    </form>

    <div v-if="hasLoginError">
        {{ loginError }}
    </div>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { useAuth } from '@/store/auth';
    import { computed, ref } from 'vue';
    import { LoginRequest, LoginResponse } from './login-models';
    import { fetchAPI } from '@/service/api/api';
    import { UnauthorizedError } from '@/service/api/models/response-errors';

    // Store
    const auth = useAuth();

    // Refs
    const username = ref<string>("");
    const password = ref<string>("");
    const loginError = ref<string>("");

    // Computed
    const hasLoginError = computed<boolean>(() => loginError.value != "");

    // Functions
    async function handleSubmit() {
        try {
            loginError.value = "";

            const loginRequest: LoginRequest = {
                username: username.value,
                password: password.value
            };

            const response = await fetchAPI<LoginResponse>('login', 'POST', loginRequest);

            auth.login(response.token);
            router.replace('/');
        }
        catch(error: any) {
            if(error instanceof UnauthorizedError) {
                loginError.value = "Wrong credentials";
            }
        }
    }
</script>