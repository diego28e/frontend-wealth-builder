import { useState, useEffect } from 'react';
import { userService } from '../services/users';
import { useAuth } from '../contexts/AuthContext';
import type { UserBalance } from '../types/api';

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchBalance() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getUserBalance(user!.id);
        setBalance(data);
      } catch (err) {
        console.error('Failed to load balance', err);
        setError(err instanceof Error ? err.message : 'Failed to load balance');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [user]);

  return { balance, isLoading, error };
}
