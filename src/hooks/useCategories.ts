import { useState, useEffect } from 'react';
import { categoryService } from '../services/categories';
import { useAuth } from '../contexts/AuthContext';
import type { Category } from '../types/api';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await categoryService.getUserCategories(user.id);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Other';
  };

  return { categories, isLoading, error, getCategoryName };
}
