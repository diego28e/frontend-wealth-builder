import { useState } from 'react';
import { Calendar, DollarSign, Store, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import type { CreateTransactionRequest } from '../../types/api';

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const { user } = useAuth();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState({
    amount: '',
    merchant_name: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category_id: '',
    type: 'Expense' as 'Income' | 'Expense',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to create transaction
    console.log('Submit:', formData);
    onSuccess?.();
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
          className="flex-1 h-11 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-green-500/30"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
