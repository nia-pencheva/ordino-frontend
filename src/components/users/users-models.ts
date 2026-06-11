export interface UsersPage {
    users: User[]
    roles: UserRole[]
    totalElements: number
    totalPages: number
}

export interface User {
    id: number
    username: string
    fullName: string
    email: string
    phoneNumber: string
    roles: string[]
};

export interface UserRole {
    id: number
    role: string
}

export enum Role {
    ADMIN = "admin",
    CHEF = "chef",
    KITCHEN_STAFF = "kitchen staff",
    LINE_COOK = "line cook",
    MANAGER = "manager",
    WAREHOUSE_MANAGER = "warehouse manager"
}

export interface AddUserResponse {
    initialPassword: string
}

export interface ResetPasswordResponse {
    newPassword: string
}