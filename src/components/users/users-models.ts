export interface User {
    id: Number
    username: string
    fullName: string
    email: string
    phoneNumber: string
    roles: string[]
};

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