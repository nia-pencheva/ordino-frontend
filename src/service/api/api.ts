import { useAuth } from "@/store/auth/auth";
import { HTTPMethod } from "./models/http-methods";
import router from "@/router";
import { UnprocessableContentError } from "./models/response-errors";

export class APICall<TData = unknown> { 
    private response?: TData;

    constructor(
        private path: string,
        private method: HTTPMethod = 'GET',
        private body?: Record<string, unknown>
    ) {};

    async execute(): Promise<TData> {
        const response = await this.fetchAPI();

        if(!response.ok)
            await this.handleErrors(response);

        return this.response ?? APICall.parseResponseText<TData>(await response.text());
    }

    private async fetchAPI(): Promise<Response> {
        return fetch(APICall.buildUrl(this.path), APICall.buildOptions(this.method, this.body))
    }

    static buildUrl(path: string): string {
        return `http://localhost:9000/${path}`;
    }

    static buildOptions(method: HTTPMethod, body?: Record<string, unknown>): RequestInit {
        const authToken: string = useAuth().token ?? "";

        const options: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            method
        }

        if(body) {
            options.body = JSON.stringify(body);
        }

        return options;
    }

    static parseResponseText<TData>(responseText: string): TData {
        let data: TData;

        if(responseText == "") {
            data = {} as TData;
        }
        else {
            data = JSON.parse(responseText) as TData
        }

        return data;
    }

    private async handleErrors(reason: Response) {
        const errorResponse = await reason.json();

        switch(reason.status) {
            case 401:
                await this.handleUnauthorized(errorResponse.error);
                break;
            case 403:
                await this.handleForbidden(errorResponse.error);
                break;
            case 404:
                this.handleNotFound();
                break;
            case 422:
                throw new UnprocessableContentError(errorResponse.errors);
            default:
                throw new Error(errorResponse);
        } 
    }

    private async handleUnauthorized(error: string) {
        switch(error) {
            case "TOKEN_EXPIRED":  
                await this.handleTokenExpired();
                break;
            case "INVALID_TOKEN": 
                await this.handleInvalidToken();
                break;
            default:
                throw new Error(error);
        }
    }

    private async handleTokenExpired() {
        try {
            await useAuth().refresh();

            const retryResponse = await fetch(APICall.buildUrl(this.path), APICall.buildOptions(this.method, this.body));

            if(!retryResponse.ok)
                throw (await retryResponse.json());
            
            this.response = APICall.parseResponseText<TData>(await retryResponse.text());
        }
        catch(refreshError: any) {
            if(["INVALID_REFRESH_TOKEN", "REFRESH_TOKEN_EXPIRED"].includes((refreshError.error))) {
                await this.handleInvalidRefreshToken();
            }
            else {
                throw refreshError;
            }
        }
    }

    private async handleInvalidRefreshToken() {
        await useAuth().logout();
        router.replace('/login');
        this.response = {} as TData;
    }

    private async handleInvalidToken() {
        await useAuth().logout();
        router.replace("/login");
        this.response = {} as TData; 
    }

    private async handleForbidden(error: string) {
        switch(error) {
            case "PASSWORD_CHANGE_REQUIRED":
                await this.handlePasswordChangeRequired();
                break;
            default:
                throw new Error(error);
        }
    }

    private async handlePasswordChangeRequired() {
        if(!useAuth().passwordChangeRequired) {
            await useAuth().logout();
            router.replace({ name: 'login' });
        }
        else {
            router.replace({ name: "change-password" });
        }
        
        this.response = {} as TData;
    }

    private handleNotFound() {
        router.replace({ name: 'not-found' });
    }
}

