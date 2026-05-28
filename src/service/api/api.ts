import { useAuth } from "@/store/auth/auth";
import { HTTPMethod } from "./models/http-methods";
import router from "@/router";
import { ErrorResponse } from "./models/response-errors";

export async function fetchAPI<TData = unknown>(
    path: string,
    method: HTTPMethod = 'GET',
    body?: Record<string, unknown>,
) {
    const response = await fetch(buildUrl(path), buildOptions(method, body));

    if (!response.ok) {
        const error = (await response.json() as ErrorResponse).error;
        
        if (response.status === 401) {
            const auth = useAuth();

            if(error === "TOKEN_EXPIRED") {
                try {
                    await auth.refresh();
                }
                catch(refreshError: any) {
                    if(["INVALID_REFRESH_TOKEN", "REFRESH_TOKEN_EXPIRED"].includes((refreshError as Error).message)) {
                        await useAuth().logout();
                        router.replace('/login');
                        return {} as TData;
                    }

                    throw refreshError;
                }

                const retryResponse = await fetch(buildUrl(path), buildOptions(method, body));

                if(!retryResponse.ok) {
                    throw new Error((await retryResponse.json() as ErrorResponse).error);
                }

                return parseResponseText<TData>(await retryResponse.text());
            }
            else if(error == "INVALID_TOKEN") {
                await useAuth().logout();
                router.replace("/login");
                return {} as TData;
            }
        }

        throw new Error(error);
    }

    return parseResponseText<TData>(await response.text());
}

export function buildUrl(path: string): string {
    return `http://localhost:9000/${path}`;
}

function buildOptions(method: HTTPMethod, body?: Record<string, unknown>): RequestInit {
    const authToken: string = useAuth().getToken() ?? "";

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

export function parseResponseText<TData>(responseText: string): TData {
    let data: TData;

    if(responseText == "") {
        data = {} as TData;
    }
    else {
        data = JSON.parse(responseText) as TData
    }

    return data;
}