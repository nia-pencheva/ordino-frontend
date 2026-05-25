import { useAuth } from "@/store/auth";
import { HTTPMethod } from "./models/http-methods";
import { ResponseError, UnauthorizedError } from "./models/response-errors";

export async function fetchAPI<TData = unknown>(
    path: string,
    method: HTTPMethod = 'GET',
    body?: Record<string, unknown>,
) {
    const response = await fetch(buildUrl(path), buildOptions(method, body));

    if(!response.ok) await handleResponseError(response);

    return parseResponseText<TData>(await response.text());
}

function buildUrl(path: string): string {
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

function parseResponseText<TData>(responseText: string): TData {
    let data: TData;

    if(responseText == "") {
        data = {} as TData;
    }
    else {
        data = JSON.parse(responseText) as TData
    }

    return data;
}

async function handleResponseError(error: any): Promise<void> {
    switch(error.status) {
        case 400:
            throw new ResponseError(await error.json());
        case 401:
            throw new UnauthorizedError();
        default:
            throw new Error("Request failed");
    }
}