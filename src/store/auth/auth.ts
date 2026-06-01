import { LoginRequest, LoginResponse, RefreshResponse, User } from "@/store/auth/auth-models";
import { APICall} from "@/service/api/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuth = defineStore("auth", () => {
    const storedUser = localStorage.getItem('authUser');

    const user = ref<User | null>(storedUser !== null ? User.fromJSON(JSON.parse(storedUser)) : null);
    const token = ref<string | null>(localStorage.getItem('authToken'));
    const refreshToken = ref<string | null>(localStorage.getItem('authRefreshToken'));
    const passwordChangeRequired = ref<boolean>(localStorage.getItem('passwordChangeRequired') === 'true');

    const isAuthenticated = computed(() => token.value !== null);

    async function login(request: LoginRequest): Promise<void> {
        const response = await (new APICall<LoginResponse>('login', 'POST', request)).execute();

        token.value = response.token;
        refreshToken.value = response.refreshToken;
        user.value = User.fromJSON(response.user);

        localStorage.setItem('authToken', token.value);
        localStorage.setItem('authRefreshToken', refreshToken.value);
        localStorage.setItem('authUser', JSON.stringify(user.value));

        console.log(response);
        if(response.passwordChangeRequired) {
            passwordChangeRequired.value = true;
            localStorage.setItem('passwordChangeRequired', 'true');
            throw new Error("PASSWORD_CHANGE_REQUIRED");
        }
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

    function markPasswordChanged() {
        passwordChangeRequired.value = false;
        localStorage.removeItem('passwordChangeRequired');
    }

    return { user, token, passwordChangeRequired, isAuthenticated, login, refresh, logout, markPasswordChanged };
});
