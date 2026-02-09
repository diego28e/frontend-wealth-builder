import { useState } from 'react';
import { Calendar, DollarSign, Store, FileText, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { transactionService } from '../../services/transactions';
import { receiptService } from '../../services/receipts';
import { toCents } from '../../lib/currency';
import type { CreateTransactionRequest } from '../../types/api';

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const { user } = useAuth();
  const { categories } = useCategories();
  const { accounts } = useAccounts(user?.id);
  
  const [formData, setFormData] = useState({
    amount: '',
    merchant_name: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category_id: '',
    account_id: '',
    type: 'Expense' as 'Income' | 'Expense',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.account_id) return;

    try {
      setIsSubmitting(true);

      let transactionData: CreateTransactionRequest = {
        user_id: user.id,
        account_id: formData.account_id,
        category_id: formData.category_id,
        date: formData.date,
        amount: toCents(formData.amount),
        type: formData.type,
        description: formData.description,
        currency_code: user.default_currency,
        merchant_name: formData.merchant_name || undefined,
      };

      if (receiptFile) {
        setIsUploadingReceipt(true);
        const receiptData = await receiptService.uploadReceipt(receiptFile, user.id);
        if (receiptData.extracted_data) {
          transactionData.amount = receiptData.extracted_data.amount ? toCents(receiptData.extracted_data.amount) : transactionData.amount;
          transactionData.merchant_name = receiptData.extracted_data.merchant || transactionData.merchant_name;
          transactionData.date = receiptData.extracted_data.date || transactionData.date;
        }
        setIsUploadingReceipt(false);
      }

      await transactionService.createTransaction(transactionData);
      
      setFormData({
        amount: '',
        merchant_name: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        category_id: '',
        account_id: '',
        type: 'Expense',
      });
      setReceiptFile(null);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create transaction', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Type Selection */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'Income' }))}
            className={`h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all ${
              formData.type === 'Income'
                ? 'bg-green-100 text-green-700 border-green-500'
                : 'border-border-color bg-surface-light text-text-secondary'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'Expense' }))}
            className={`h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all ${
              formData.type === 'Expense'
                ? 'bg-red-100 text-red-700 border-red-500'
                : 'border-border-color bg-surface-light text-text-secondary'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Account Selection */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Account
        </label>
        <select
          name="account_id"
          value={formData.account_id}
          onChange={handleInputChange}
          className="w-full h-11 px-4 bg-surface-light border border-border-color rounded-lg text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          required
        >
          <option value="">Select account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.type})
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Amount
        </label>
        <div className="relative">
          <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full h-11 pl-10 pr-4 bg-surface-light border border-border-color rounded-lg text-text-main font-bold focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="0.00"
            type="number"
            step="0.01"
            required
          />
        </div>
      </div>

      {/* Merchant */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Merchant
        </label>
        <div className="relative">
          <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            name="merchant_name"
            value={formData.merchant_name}
            onChange={handleInputChange}
            className="w-full h-11 pl-10 pr-4 bg-surface-light border border-border-color rounded-lg text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g. Starbucks, Uber"
            type="text"
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Date
        </label>
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full h-11 pl-10 pr-4 bg-surface-light border border-border-color rounded-lg text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            type="date"
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          className="w-full h-11 px-4 bg-surface-light border border-border-color rounded-lg text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Receipt Upload */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Receipt (Optional)
        </label>
        <div className="relative">
          <Upload size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            className="w-full h-11 pl-10 pr-4 bg-surface-light border border-border-color rounded-lg text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
          />
        </div>
        {receiptFile && (
          <p className="text-xs text-gray-600 mt-1">{receiptFile.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          Description
        </label>
        <div className="relative">
          <FileText size={18} className="absolute left-3 top-3 text-text-secondary" />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 pl-10 bg-surface-light border border-border-color rounded-lg text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Add a description..."
            rows={3}
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 border border-border-color text-text-main font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isUploadingReceipt}
          className="flex-1 h-11 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50"
        >
          {isUploadingReceipt ? 'Processing Receipt...' : isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
