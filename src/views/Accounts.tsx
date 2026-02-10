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

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add Account'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <h3 className="font-semibold">{editingAccount ? 'Edit Account' : 'Create Account'}</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Main Checking"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
              className="w-full px-3 py-2 border rounded-lg"
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
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={formData.currency_code}
              onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Balance</label>
            <input
              type="number"
              step="0.01"
              value={formData.current_balance}
              onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <AccountConfigForm
            configurations={configurations}
            onChange={setConfigurations}
            currencyCode={formData.currency_code}
          />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : editingAccount ? 'Update Account' : 'Create Account'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{account.name}</h3>
                <p className="text-sm text-gray-600">{account.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {fromCents(account.current_balance).toLocaleString('en-US', {
                      style: 'currency',
                      currency: account.currency_code,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">{account.currency_code}</p>
                </div>
                <button
                  onClick={() => handleEdit(account)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                  title="Edit account"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
            
            {account.configurations && account.configurations.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Settings size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">Fees & Taxes</span>
                </div>
                <div className="space-y-1">
                  {account.configurations.map((config, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex justify-between">
                      <span>{config.name}</span>
                      <span className="font-medium">
                        {config.type === 'PERCENTAGE' ? `${config.value}%` : `${config.currency_code || account.currency_code} ${config.value}`}
                        {' '}
                        ({config.frequency.toLowerCase().replace('_', ' ')})
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
