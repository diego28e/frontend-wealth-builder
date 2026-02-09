import { apiClient } from '../lib/api';
import type { Account, CreateAccountRequest } from '../types/api';

export const accountService = {
    getUserAccounts: async (userId: string): Promise<Account[]> => {
        return apiClient<Account[]>(`/users/${userId}/accounts`);
    },

    createAccount: async (data: CreateAccountRequest): Promise<Account> => {
        return apiClient<Account>('/accounts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
