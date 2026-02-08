import {apiClient} from '../lib/api';
import type {Category, CategoryGroup} from '../types/api';

export const categoryService = {
    async getUserCategories(userId: string): Promise<Category[]> {
        return apiClient<Category[]>(`/users/${userId}/categories`);
    },
    async getCategoryGroups(): Promise<CategoryGroup[]> {
        return apiClient<CategoryGroup[]>('/category-groups');
    }
}