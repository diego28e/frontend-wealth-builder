import {useState, useEffect} from 'react';
import {transactionService} from '../services/transactions';
import type {CategoryGroupSummary} from '../types/api';

export const useCategoryGroupSummary = (
    userId: string | undefined,
    startDate?: string,
    endDate?: string
) => {
    const [summary, setSummary] = useState<CategoryGroupSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const fetchSummary = async () => {
            try {
                setIsLoading(true);
                const data = await transactionService.getCategoryGroupSummary(userId, startDate, endDate);
                setSummary(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch summary');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, [userId, startDate, endDate]);
    
    return {summary, isLoading, error};
}