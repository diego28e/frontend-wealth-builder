import { useState, useEffect } from 'react';
import { categoryService } from '../services/categories';
import { useAuth } from '../contexts/AuthContext';
import type { Category, CategoryGroup } from '../types/api';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [categoriesData, groupsData] = await Promise.all([
          categoryService.getUserCategories(user.id),
          categoryService.getCategoryGroups(),
        ]);
        setCategories(categoriesData);
        setCategoryGroups(groupsData);
      } catch (err) {
        console.error('Failed to load categories', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Other';
  };

  const getCategoryGroupId = (categoryId: string): string | undefined => {
    return categories.find((cat) => cat.id === categoryId)?.category_group_id;
  };

  const getCategoryGroupName = (groupId: string): string => {
    return categoryGroups.find((g) => g.id === groupId)?.name || 'Other';
  };

  return { categories, categoryGroups, isLoading, error, getCategoryName, getCategoryGroupId, getCategoryGroupName };
}
