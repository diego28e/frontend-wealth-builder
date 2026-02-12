import { useState, useRef } from 'react';
import { X, Upload, DollarSign, Calendar, Store, FileText, ScanLine, Receipt, CreditCard, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccounts } from '../../hooks/useAccounts';
import { CategorySelect } from '../common/CategorySelect';
import { transactionService } from '../../services/transactions';
import { receiptService } from '../../services/receipts';
import { toCents } from '../../lib/currency';
import type { CreateTransactionRequest } from '../../types/api';

interface TransactionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = 'manual' | 'scan';

export function TransactionSidebar({ isOpen, onClose, onSuccess }: TransactionSidebarProps) {
  const { user } = useAuth();
  const { accounts } = useAccounts(user?.id);
  const [activeTab, setActiveTab] = useState<Tab>('manual');

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    merchant_name: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category_id: '',
    account_id: '',
    transfer_destination_account_id: '', // New field
    type: 'Expense' as 'Income' | 'Expense' | 'Transfer',
  });

  // Scan State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [scanAccountId, setScanAccountId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.account_id) return;

    // Validate Transfer
    if (formData.type === 'Transfer' && !formData.transfer_destination_account_id) {
      alert("Please select a destination account for the transfer.");
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedAccount = accounts.find(acc => acc.id === formData.account_id);
      if (!selectedAccount) return;

      const dateObj = new Date(formData.date);
      const now = new Date();
      dateObj.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const transactionData: CreateTransactionRequest = {
        user_id: user.id,
        account_id: formData.account_id,
        category_id: formData.category_id,
        date: dateObj.toISOString(),
        amount: toCents(formData.amount),
        type: formData.type,
        description: formData.description,
        currency_code: selectedAccount.currency_code,
        merchant_name: formData.merchant_name || undefined,
        transfer_destination_account_id: formData.type === 'Transfer' ? formData.transfer_destination_account_id : undefined,
      };

      await transactionService.createTransaction(transactionData);
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create transaction', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !scanAccountId || !receiptFile) return;

    try {
      setIsScanning(true);
      const receiptData = await receiptService.uploadReceipt(receiptFile, user.id, scanAccountId);

      // Auto-populate manual form with scanned data for review
      setFormData(prev => ({
        ...prev,
        account_id: scanAccountId,
        amount: receiptData.extracted_data?.amount?.toString() || '',
        merchant_name: receiptData.extracted_data?.merchant || '',
        date: receiptData.extracted_data?.date ? new Date(receiptData.extracted_data.date).toISOString().split('T')[0] : prev.date,
        description: 'Receipt Scan Import',
        type: 'Expense'
      }));

      // Switch to manual tab for review
      setActiveTab('manual');
      setReceiptFile(null); // Clear file after scan
      setIsScanning(false);
    } catch (err) {
      console.error('Failed to scan receipt', err);
      setIsScanning(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      merchant_name: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category_id: '',
      account_id: '',
      transfer_destination_account_id: '',
      type: 'Expense',
    });
    setReceiptFile(null);
    setScanAccountId('');
    setActiveTab('manual');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const focusClass = formData.type === 'Income'
    ? 'focus:ring-green-500/20 focus:border-green-500'
    : formData.type === 'Transfer'
      ? 'focus:ring-blue-500/20 focus:border-blue-500'
      : 'focus:ring-red-500/20 focus:border-red-500';

  const iconClass = formData.type === 'Income'
    ? 'text-green-500'
    : formData.type === 'Transfer'
      ? 'text-blue-500'
      : 'text-red-500';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'manual'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <FileText size={18} />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'scan'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <ScanLine size={18} />
              Scan Receipt
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'manual' ? (
              <form
                onSubmit={handleManualSubmit}
                className={`flex flex-col gap-5 p-6 rounded-2xl border transition-all duration-300 bg-white ${formData.type === 'Income'
                  ? 'border-green-200 shadow-[0_4px_20px_-4px_rgba(34,197,94,0.1)]'
                  : formData.type === 'Transfer'
                    ? 'border-blue-200 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]'
                    : 'border-red-200 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)]'
                  }`}
              >
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Transaction Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'Income' }))}
                      className={`h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all ${formData.type === 'Income'
                        ? 'bg-green-100 text-green-700 border-green-500 shadow-sm'
                        : 'border-border-color bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'Expense' }))}
                      className={`h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all ${formData.type === 'Expense'
                        ? 'bg-red-100 text-red-700 border-red-500 shadow-sm'
                        : 'border-border-color bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'Transfer' }))}
                      className={`h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all ${formData.type === 'Transfer'
                        ? 'bg-blue-100 text-blue-700 border-blue-500 shadow-sm'
                        : 'border-border-color bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      Transfer
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${iconClass}`} size={20} />
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-2 transition-all outline-none ${focusClass}`}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
                      }}
                    />
                  </div>
                </div>

                {/* Account & Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {formData.type === 'Transfer' ? 'From Account' : 'Account'}
                    </label>
                    <div className="relative">
                      <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${iconClass}`} size={16} />
                      <select
                        name="account_id"
                        required
                        value={formData.account_id}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 transition-all outline-none appearance-none ${focusClass}`}
                      >
                        <option value="">Select</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                    <div className="relative">
                      <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${iconClass}`} size={16} />
                      <input
                        name="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Destination Account (Only for Transfer) */}
                {formData.type === 'Transfer' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To Account</label>
                    <div className="relative">
                      <ArrowRightLeft className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${iconClass}`} size={16} />
                      <select
                        name="transfer_destination_account_id"
                        required
                        value={formData.transfer_destination_account_id}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 transition-all outline-none appearance-none ${focusClass}`}
                      >
                        <option value="">Select Destination</option>
                        {accounts
                          .filter(acc => acc.id !== formData.account_id) // Exclude source account
                          .map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <CategorySelect
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className={`bg-white border text-gray-900 border-gray-200 ${focusClass}`}
                    required
                  />
                </div>

                {/* Merchant & Description */}
                <div className="space-y-4">
                  {formData.type !== 'Transfer' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Merchant</label>
                      <div className="relative">
                        <Store className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${iconClass}`} size={18} />
                        <input
                          name="merchant_name"
                          type="text"
                          value={formData.merchant_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Starbucks"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={formData.type === 'Transfer' ? "Transfer details..." : "What was this for?"}
                      rows={3}
                      className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 transition-all outline-none resize-none ${focusClass}`}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleScanSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="text-primary" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Scan Receipt</h3>
                  <p className="text-sm text-gray-500 mt-1">Upload a photo or PDF to extract details</p>
                </div>

                {/* Account Selection for Receipt */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Account</label>
                  <select
                    value={scanAccountId}
                    onChange={(e) => setScanAccountId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  >
                    <option value="">Select Account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>

                {/* File Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${receiptFile
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  />
                  {receiptFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="text-primary mb-2" size={32} />
                      <p className="font-medium text-gray-900">{receiptFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <p className="font-medium text-gray-900">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF</p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {activeTab === 'manual' ? (
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className={`w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${formData.type === 'Income'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                  : formData.type === 'Transfer'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  `Add ${formData.type}`
                )}
              </button>
            ) : (
              <button
                onClick={handleScanSubmit}
                disabled={isScanning || !scanAccountId || !receiptFile}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  'Scan & Review'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
