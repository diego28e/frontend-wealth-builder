import { useState } from 'react';
import { Settings, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAccounts } from '../hooks/useAccounts';
import { useCurrencies } from '../hooks/useCurrencies';
import { accountService } from '../services/accounts';
import { toCents, fromCents } from '../lib/currency';
import { AccountConfigForm } from '../components/accounts/AccountConfigForm';
import type { AccountType, CreateAccountRequest, UpdateAccountRequest, AccountConfiguration, Account } from '../types/api';

export default function Accounts() {
  const { user } = useAuth();
  const { accounts, isLoading, refetch } = useAccounts(user?.id);
  const { currencies } = useCurrencies();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Savings' as AccountType,
    currency_code: user?.default_currency || 'COP',
    current_balance: '',
  });
  const [configurations, setConfigurations] = useState<AccountConfiguration[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      if (editingAccount) {
        const request: UpdateAccountRequest = {
          name: formData.name,
          type: formData.type,
          currency_code: formData.currency_code,
          current_balance: toCents(formData.current_balance),
          configurations: configurations.length > 0 ? configurations : undefined,
        };
        await accountService.updateAccount(editingAccount.id, request);
      } else {
        const request: CreateAccountRequest = {
          user_id: user.id,
          name: formData.name,
          type: formData.type,
          currency_code: formData.currency_code,
          current_balance: toCents(formData.current_balance),
          configurations: configurations.length > 0 ? configurations : undefined,
        };
        await accountService.createAccount(request);
      }
      
      setFormData({ name: '', type: 'Checking', currency_code: user.default_currency, current_balance: '' });
      setConfigurations([]);
      setShowForm(false);
      setEditingAccount(null);
      refetch();
    } catch (err) {
      console.error('Failed to save account', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      currency_code: account.currency_code,
      current_balance: fromCents(account.current_balance).toString(),
    });
    setConfigurations(account.configurations || []);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAccount(null);
    setFormData({ name: '', type: 'Checking', currency_code: user?.default_currency || 'COP', current_balance: '' });
    setConfigurations([]);
  };

  if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Accounts</h2>
          <p className="text-gray-500 mt-1 font-medium">
            Manage your bank accounts, wallets, and investments.
          </p>
        </div>
        <button
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95 shadow-lg ${
              showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-primary text-white hover:bg-primary-hover shadow-primary/25'
          }`}
        >
          {showForm ? 'Cancel' : '+ Add Account'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                  {editingAccount ? 'Edit Account' : 'New Account Details'}
              </h3>
              <p className="text-sm text-gray-500">Configure your account settings below.</p>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                    <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="e.g., Main Checking"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Balance</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input
                        type="number"
                        step="0.01"
                        value={formData.current_balance}
                        onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="0.00"
                        required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                    <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                    >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                    <select
                    value={formData.currency_code}
                    onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                    >
                    {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                        </option>
                    ))}
                    </select>
                </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
                <AccountConfigForm
                    configurations={configurations}
                    onChange={setConfigurations}
                    currencyCode={formData.currency_code}
                />
            </div>
            
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                    {isSubmitting ? 'Saving...' : editingAccount ? 'Update Account' : 'Create Account'}
                </button>
            </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-primary/20 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                account.type === 'Checking' ? 'bg-blue-500' :
                account.type === 'Savings' ? 'bg-green-500' :
                account.type === 'Credit Card' ? 'bg-purple-500' :
                'bg-gray-400'
            }`}></div>
            
            <div className="flex justify-between items-start mb-4 pl-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{account.type}</p>
                <h3 className="font-bold text-xl text-gray-900 truncate pr-2">{account.name}</h3>
              </div>
              <button
                onClick={() => handleEdit(account)}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Edit account"
              >
                <Edit2 size={18} />
              </button>
            </div>
            
            <div className="pl-3 mb-4">
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {fromCents(account.current_balance).toLocaleString('en-US', {
                    style: 'currency',
                    currency: account.currency_code,
                })}
                </p>
                <p className="text-sm font-medium text-gray-400 mt-1">{account.currency_code}</p>
            </div>
            
            {account.configurations && account.configurations.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-2 pl-3">
                <div className="flex items-center gap-2 mb-2">
                  <Settings size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Configurations</span>
                </div>
                <div className="space-y-1.5">
                  {account.configurations.map((config, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{config.name}</span>
                      <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded text-xs">
                        {config.type === 'PERCENTAGE' ? `${config.value}%` : `${config.currency_code || account.currency_code} ${config.value}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
