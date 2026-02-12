export type UserProfileType = 'Low-Income' | 'High-Income/High-Expense' | 'Wealth-Builder';
export type TransactionType = 'Income' | 'Expense';
export type CategoryGroupName = 'Income' | 'Needs' | 'Wants' | 'Savings';
export type AccountType = 'Checking' | 'Savings' | 'Credit Card' | 'Cash' | 'Investment' | 'Other';
export type ConfigurationType = 'PERCENTAGE' | 'FIXED';
export type ConfigurationFrequency = 'PER_TRANSACTION' | 'MONTHLY' | 'ANNUAL' | 'ONE_TIME';
export type ConfigurationAppliesTo = 'INCOME' | 'EXPENSE' | 'BALANCE' | 'ALL';

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
    category_group_id: string;
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

export interface AccountConfiguration {
    id?: string;
    account_id?: string;
    name: string;
    type: ConfigurationType;
    value: number;
    currency_code?: string;
    frequency: ConfigurationFrequency;
    applies_to?: ConfigurationAppliesTo;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Account {
    id: string;
    user_id: string;
    name: string;
    type: AccountType;
    currency_code: string;
    current_balance: number;
    interest_rate?: number;
    is_tax_exempt?: boolean;
    is_active: boolean;
    configurations?: AccountConfiguration[];
    created_at: string;
    updated_at: string;
}

export interface CreateAccountRequest {
    user_id: string;
    name: string;
    type: AccountType;
    currency_code: string;
    current_balance: number;
    interest_rate?: number;
    is_tax_exempt?: boolean;
    configurations?: AccountConfiguration[];
}

export interface UpdateAccountRequest {
    name?: string;
    type?: AccountType;
    currency_code?: string;
    current_balance?: number;
    interest_rate?: number;
    is_tax_exempt?: boolean;
    is_active?: boolean;
    configurations?: AccountConfiguration[];
}

export interface Transaction {
    id: string;
    user_id: string;
    account_id: string;
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
    transaction_items?: TransactionItem[];
}

export interface CreateTransactionRequest {
    user_id: string;
    account_id: string;
    category_id: string;
    goal_id?: string;
    date: string;
    amount: number;
    type: TransactionType;
    description: string;
    notes?: string;
    currency_code: string;
    merchant_name?: string;
    transaction_items?: TransactionItem[];
}

export interface TransactionItem {
    id: string;
    transaction_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    category_id: string;
    sort_order: number;
    created_at: string;
}

export interface ReceiptUploadResponse {
    transaction_id: string;
    receipt_url: string;
    extracted_data?: {
        amount?: number;
        merchant?: string;
        date?: string;
    };
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface UserBalance {
    starting_balance: number;
    starting_balance_date: string;
    starting_balance_currency_code: string;
    current_calculated_balance: number;
}


export interface UpdateStartingBalanceRequest {
    starting_balance: number;
    currency_code: string;
}

export interface CategoryGroupSummary {
    category_group_id: string;
    category_group_name: CategoryGroupName;
    total_amount:number;
    transaction_count: number;
}

export interface FinancialGoal {
    id: string;
    user_id: string;
    name: string;
    description: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    currency_code: string;
    category_id?: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateFinancialGoalRequest {
    user_id: string;
    name: string;
    description: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    currency_code: string;
    category_id?: string;
}

export interface UpdateFinancialGoalRequest {
    user_id: string;
    name?: string;
    description?: string;
    target_amount?: number;
    current_amount?: number;
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    target_date?: string;
    category_id?: string;
}