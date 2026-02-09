import { apiClient } from '../lib/api';
import type { Currency } from '../types/api';

export const currencyService = {
    getCurrencies: async (): Promise<Currency[]> => {
        return apiClient<Currency[]>('/currencies');
    },
};
