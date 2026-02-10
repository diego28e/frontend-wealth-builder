import { apiClient } from '../lib/api';
import type { ReceiptUploadResponse } from '../types/api';

export const receiptService = {
    uploadReceipt: async (file: File, userId: string, accountId: string): Promise<ReceiptUploadResponse> => {
        // Convert file to base64
        const toBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        };

        const base64Image = await toBase64(file);
        
        const payload = {
            image_base64: base64Image,
            user_id: userId,
            account_id: accountId
        };

        return apiClient<ReceiptUploadResponse>('/receipts/upload', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};
