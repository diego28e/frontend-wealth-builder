import { apiClient } from '../lib/api';
import type { FinancialGoal, CreateFinancialGoalRequest, UpdateFinancialGoalRequest } from '../types/api';

export const goalService = {
  getGoals: async (userId: string) => {
    return apiClient<FinancialGoal[]>(`/users/${userId}/goals`);
  },

  createGoal: async (data: CreateFinancialGoalRequest) => {
    return apiClient<FinancialGoal>('/goals', {
        method: 'POST',
        body: JSON.stringify(data),
    });
  },

  updateGoal: async (id: string, data: UpdateFinancialGoalRequest) => {
    return apiClient<FinancialGoal>(`/goals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
  },

  deleteGoal: async (id: string) => {
    return apiClient<void>(`/goals/${id}`, {
        method: 'DELETE',
    });
  },
};

