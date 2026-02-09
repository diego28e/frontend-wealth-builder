import { apiClient } from '../lib/api';
import type { ReceiptUploadResponse } from '../types/api';

export const receiptService = {
    uploadReceipt: async (file: File, userId: string): Promise<ReceiptUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);

        return apiClient<ReceiptUploadResponse>('/receipts/upload', {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
        });
    },
};
