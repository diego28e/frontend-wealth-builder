import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactions';
import type { Transaction } from '../types/api';

export function useTransactions(userId: string | undefined, startDate?: string, endDate?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchTransactions() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await transactionService.getUserTransactions(
          userId,
          startDate,
          endDate
        );
        setTransactions(data);
      } catch (err) {
        console.error('Failed to load transactions', err);
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [userId, startDate, endDate]);

  return { transactions, isLoading, error };
}
