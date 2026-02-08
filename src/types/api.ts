export type UserProfileType = 'Low-Income' | 'High-Income/High-Expense' | 'Wealth-Builder';

interface UserBase {
    email: string;
    first_name: string;
    last_name: string;
    profile: UserProfileType;
    default_currency: string;
}

// User-related types
export interface User extends UserBase {
    id: string;
    created_at: string;
    updated_at: string;
}

//Auth request/responsse types
export interface LoginRequest {
    email:string;
    password:string;
}

export interface RegisterRequest extends Pick<UserBase, 'email'|'first_name' | 'last_name' | 'profile'> {
    password:string;
}

export interface AuthResponse {
    user:User;
}

export interface ErrorResponse{
    error:string;
}