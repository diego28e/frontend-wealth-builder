import { apiClient } from '../lib/api';
import type { FinancialGoal, CreateFinancialGoalRequest } from '../types/api';

export const goalService = {
  getGoals: async (userId: string) => {
    return apiClient<FinancialGoal[]>(`/users/${userId}/financial-goals`);
  },

  createGoal: async (data: CreateFinancialGoalRequest) => {
    return apiClient<FinancialGoal>('/financial-goals', {
        method: 'POST',
        body: JSON.stringify(data),
    });
  },
};
