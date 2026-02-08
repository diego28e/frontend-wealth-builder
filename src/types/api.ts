export type UserProfileType = 'Low-Income' | 'High-Income/High-Expense' | 'Wealth-Builder';
export type TransactionType = 'Income' | 'Expense';
export type CategoryGroupName = 'Income' | 'Needs' | 'Wants' | 'Savings';

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

//Transaction types
export interface Category {
    id: string;
    user_id: string;
    name: string;
    description: string;
    is_active: boolean;
    is_system: boolean;
    sort_order: number;
}

export interface CategoryGroup {
    id: string;
    name: CategoryGroupName;
    description: string;
    sort_order: number;
}

export interface Transaction {
    id: string;
    user_id: string;
    category_id: string;
    goal_id: string | null;
    date: string;
    amount: number;
    type: TransactionType;
    description: string;
    notes: string | null;
    currency_code: string;
    merchant_name: string | null;
    has_line_items: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateTransactionRequest {
    user_id: string;
    category_id: string;
    goal_id?:string;
    date: string;
    amount: number;
    type: TransactionType;
    description: string;
    notes?:string;
    currency_code: string;
    merchant_name?:string;
}
