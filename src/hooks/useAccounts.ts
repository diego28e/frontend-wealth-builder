import { useState, useEffect } from 'react';
import { accountService } from '../services/accounts';
import type { Account } from '../types/api';

export const useAccounts = (userId: string | undefined) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                const data = await accountService.getUserAccounts(userId);
                setAccounts(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, [userId]);

    return { accounts, isLoading, error, refetch: () => userId && accountService.getUserAccounts(userId).then(setAccounts) };
};
