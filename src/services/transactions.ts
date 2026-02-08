import {apiClient} from '../lib/api';
import type {Transaction, CreateTransactionRequest} from '../types/api';

export const transactionService = {
    async getUserTransactions(userId: string): Promise<Transaction[]> {
        return apiClient<Transaction[]>(`/users/${userId}/transactions`);
    },
    async getTransactionById(id:string):Promise<Transaction> {
        return apiClient<Transaction>(`/transactions/${id}`);
    },
    async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
        return apiClient<Transaction>('/transactions/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async updateTransaction(id:string, data: Partial<CreateTransactionRequest>): Promise<Transaction> {
        return apiClient<Transaction>(`/transaction/${id}`,{
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async deleteTransaction(id:string):Promise<void> {
        await apiClient(`/transactions/${id}`, {
            method: 'DELETE',
        });
    }
}