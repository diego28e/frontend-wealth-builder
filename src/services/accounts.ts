import { apiClient } from '../lib/api';
import type { Account, CreateAccountRequest, UpdateAccountRequest } from '../types/api';

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

    updateAccount: async (accountId: string, data: UpdateAccountRequest): Promise<Account> => {
        return apiClient<Account>(`/accounts/${accountId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};
