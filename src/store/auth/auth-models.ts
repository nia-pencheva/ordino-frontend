export interface LoginRequest extends Record<string, unknown> {
    username: string,
    password: string
}

export interface LoginResponse {
    user: User
    token: string
    refreshToken: string
}

export interface RefreshResponse {
    token: string
    refreshToken: string
}

export class User {
    name: string;
    roles: Role[];

    constructor(name: string, roles: Role[]) {
        this.name = name;
        this.roles = roles;
    }

    public isAdmin(): boolean {
        return this.roles?.includes(Role.ADMIN) ?? false;
    }

    static fromJSON(data: any): User {
        return new User(data.name, data.roles);
    }
}

export enum Role {
    ADMIN = "admin",
    CHEF = "chef",
    KITCHEN_STAFF = "kitchen staff",
    LINE_COOK = "line cook",
    MANAGER = "manager",
    WAREHOUSE_MANAGER = "warehouse manager"
}