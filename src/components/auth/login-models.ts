export interface LoginRequest extends Record<string, unknown> {
    username: string,
    password: string
}

export interface LoginResponse {
    token: string
}