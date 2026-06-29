import { useAuth } from "@/store/auth/auth";
import { useNotFound } from "@/store/not-found/not-found";
import { HTTPMethod } from "./models/http-methods";
import router from "@/router";
import { APIHandledError, UnprocessableContentError } from "./models/response-errors";

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
        switch(reason.status) {
            case 400:
                this.handleBadRequest();
                break;
            case 401:
                await this.handleUnauthorized(reason);
                break;
            case 403:
                await this.handleForbidden(reason);
                break;
            case 404:
                this.handleNotFound();
                break;
            case 422:
                await this.handleUnprocessableContent(reason)
                break;
            default:
                throw new Error(await reason.text());
        } 
    }

    private handleBadRequest() {
        useNotFound().show();
        throw new APIHandledError();
    }

    private async handleUnauthorized(reason: Response) {
        const error = (await reason.json()).error;

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
        throw new APIHandledError();
    }

    private async handleInvalidToken() {
        await useAuth().logout();
        router.replace("/login");
        throw new APIHandledError();
    }

    private async handleForbidden(reason: Response) {
        const error = (await reason.json()).error;

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

        throw new APIHandledError();
    }

    private handleNotFound() {
        useNotFound().show();
        throw new APIHandledError();
    }

    private async handleUnprocessableContent(reason: Response) {
        const errors = (await reason.json()).errors;
        throw new UnprocessableContentError(errors);
    }
}

