import { Role } from "@/components/users/users-models"

export interface LoginRequest extends Record<string, unknown> {
    username: string,
    password: string
}

export interface LoginResponse {
    user: User
    token: string
    refreshToken: string
    passwordChangeRequired: boolean
}

export interface RefreshResponse {
    token: string
    refreshToken: string
}

export class User {
    username: string;
    name: string;
    roles: Role[];

    constructor(username: string, name: string, roles: Role[]) {
        this.username = username;
        this.name = name;
        this.roles = roles;
    }

    public hasRoles(roles: Role[]): boolean {
        return roles.some(role => this.roles?.includes(role)) ?? false;
    }

    static fromJSON(data: any): User {
        return new User(data.username, data.name, data.roles);
    }
}