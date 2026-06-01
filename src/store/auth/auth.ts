import { LoginRequest, LoginResponse, RefreshResponse, User } from "@/store/auth/auth-models";
import { APICall} from "@/service/api/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ErrorResponse } from "@/service/api/models/response-errors";

export const useAuth = defineStore("auth", () => {
    const storedUser = localStorage.getItem('authUser');

    const user = ref<User | null>(storedUser !== null ? User.fromJSON(JSON.parse(storedUser)) : null);
    const token = ref<string | null>(localStorage.getItem('authToken'));
    const refreshToken = ref<string | null>(localStorage.getItem('authRefreshToken'));

    const isAuthenticated = computed(() => token.value !== null);

    function getToken(): string | null {
        return token.value;
    }

    async function login(request: LoginRequest): Promise<void> {
        const response = await fetchAPI<LoginResponse>('login', 'POST', request);

        token.value = response.token;
        refreshToken.value = response.refreshToken;
        user.value = User.fromJSON(response.user);

        localStorage.setItem('authToken', token.value);
        localStorage.setItem('authRefreshToken', refreshToken.value);
        localStorage.setItem('authUser', JSON.stringify(user.value));
    }

    async function refresh(): Promise<void> {
        if (!refreshToken.value) throw new Error("No refresh token");

        const response = await fetch(APICall.buildUrl("refresh"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken.value })
        });

        if(!response.ok) {
            throw (await response.json()); 
        }

        let data =APICall.parseResponseText<RefreshResponse>(await response.text());

        token.value = data.token;
        refreshToken.value = data.refreshToken;
        localStorage.setItem('authToken', token.value);
        localStorage.setItem('authRefreshToken', refreshToken.value);
    }

    async function logout(): Promise<void> {
        await fetch(APICall.buildUrl("logout"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: refreshToken.value })
        });

        token.value = null;
        user.value = null;
        refreshToken.value = null;

        localStorage.removeItem('authToken');
        localStorage.removeItem('authRefreshToken');
        localStorage.removeItem('authUser');
    }

    return { user, token, isAuthenticated, getToken, login, refresh, logout };
});
