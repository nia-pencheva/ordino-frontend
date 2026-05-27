import { LoginRequest, LoginResponse, User } from "@/store/auth/auth-models";
import { fetchAPI } from "@/service/api/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuth = defineStore("auth", () => {
    const storedUser = localStorage.getItem('authUser');
    
    const user = ref<User | null>(storedUser !== null ? User.fromJSON(JSON.parse(storedUser)) : null);
    const token = ref<string | null>(localStorage.getItem('authToken'));

    const isAuthenticated = computed(() => token.value !== null);

    function getToken(): string | null {
        return token.value;
    }

    async function login(request: LoginRequest): Promise<void> {
        const response = await fetchAPI<LoginResponse>('login', 'POST', request);

        token.value = response.token;
        user.value = User.fromJSON(response.user);

        localStorage.setItem('authToken', token.value);
        localStorage.setItem('authUser', JSON.stringify(user.value))
    }

    function logout(): void {
        token.value = null;
        user.value = null;
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser')
    }

    return { user, token, isAuthenticated, getToken, login, logout };
});
