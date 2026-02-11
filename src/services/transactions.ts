import {apiClient} from '../lib/api';
import type {Transaction, CreateTransactionRequest, CategoryGroupSummary} from '../types/api';

export const transactionService = {
    async getUserTransactions(
        userId: string,
        startDate?:string,
        endDate?:string
    ): Promise<Transaction[]> {

        let url = `/users/${userId}/transactions`;

        if (startDate && endDate) {
            url += `?start_date=${startDate}&end_date=${endDate}`;
        }

        // Create a type for the paginated response locally or import it if added to types
        // For now, allow any to handle the structure flexibly
        const response = await apiClient<{ data: Transaction[], meta: any }>(url);
        // Return just the data array to keep the rest of the app working
        return response.data || [];
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
    },

    async getCategoryGroupSummary(
        userId:string,
        startDate?:string,
        endDate?:string
    ) : Promise<CategoryGroupSummary[]> {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiClient<CategoryGroupSummary[]>(`/users/${userId}/category-group-summary${query}`)
    }
}