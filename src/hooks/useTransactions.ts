import {useState, useEffect} from 'react';
import {transactionService} from '../services/transactions';
import {useAuth} from '../contexts/AuthContext';
import type {Transaction} from '../types/api';

export function useTransactions() {
    const {user} = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        if(!user) return;

        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await transactionService.getUserTransactions(user.id);
                setTransactions(data);
            } catch (err) {
                console.error('Failed to load transactions', err);
                setError(err instanceof Error ? err.message : 'Failed to load transactions');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, [user]);

    return {transactions, isLoading, error}
}