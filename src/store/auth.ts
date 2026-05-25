import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuth = defineStore("auth", () => {
    const user = ref<{ id: number; name: string } | null>(null);
    const token = ref<string | null>(localStorage.getItem('authToken'));

    const isAuthenticated = computed(() => token.value !== null);

    function getToken(): string | null {
        return token.value;
    }

    function login(newToken: string): void {
        token.value = newToken;
        localStorage.setItem('authToken', newToken);
    }

    function logout(): void {
        user.value = null;
        token.value = null;
        localStorage.removeItem('authToken');
    }

    return { user, token, isAuthenticated, getToken, login, logout };
});
