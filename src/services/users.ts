import {apiClient} from '../lib/api';
import type {User, UserBalance, UpdateStartingBalanceRequest} from '../types/api';

export const userService = {
    async getUser(userId: string): Promise<User> {
        return apiClient<User>(`/users/${userId}`);
    },

    async getUserBalance(userId: string): Promise<UserBalance> {
        return apiClient<UserBalance>(`/users/${userId}/balance`);
    },

    async updateStartingBalance(userId: string, data: UpdateStartingBalanceRequest) : Promise<User> {
        return apiClient<User>(`/users/${userId}/starting-balance`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};