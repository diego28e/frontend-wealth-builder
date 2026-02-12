import { useState } from 'react';
import { Settings, Edit2, Percent, ShieldCheck } from 'lucide-react';
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
    interest_rate: '',
    is_tax_exempt: false,
    is_liquid: true,
  });

  const [configurations, setConfigurations] = useState<AccountConfiguration[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      const commonData = {
        name: formData.name,
        type: formData.type,
        currency_code: formData.currency_code,
        current_balance: toCents(formData.current_balance),
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : 0,
        is_tax_exempt: formData.is_tax_exempt,
        is_liquid: formData.is_liquid,
        configurations: configurations.length > 0 ? configurations : undefined,
      };

      if (editingAccount) {
        const request: UpdateAccountRequest = {
          ...commonData,
        };
        await accountService.updateAccount(editingAccount.id, request);
      } else {
        const request: CreateAccountRequest = {
          user_id: user.id,
          ...commonData,
        };
        await accountService.createAccount(request);
      }

      resetForm();
      refetch();
    } catch (err) {
      console.error('Failed to save account', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Checking',
      currency_code: user?.default_currency || 'COP',
      current_balance: '',
      interest_rate: '',
      is_tax_exempt: false,
      is_liquid: true
    });
    setConfigurations([]);
    setShowForm(false);
    setEditingAccount(null);
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      currency_code: account.currency_code,
      current_balance: fromCents(account.current_balance).toString(),
      interest_rate: account.interest_rate ? account.interest_rate.toString() : '',
      is_tax_exempt: account.is_tax_exempt || false,
      is_liquid: account.is_liquid ?? true,
    });
    setConfigurations(account.configurations || []);
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
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
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95 shadow-lg ${showForm
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs">1</span>
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
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
            </div>

            {/* Section 2: Financial Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs">2</span>
                Financial Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Yield / Interest Rate (E.A)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.interest_rate}
                      onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Effective Annual Rate (E.A)</p>
                </div>
                <div className="flex items-center h-full pt-6 gap-6">
                  {/* Tax Exempt Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${formData.is_tax_exempt ? 'bg-primary border-primary' : 'bg-white border-gray-300 group-hover:border-primary'}`}>
                      {formData.is_tax_exempt && <ShieldCheck size={16} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.is_tax_exempt}
                      onChange={(e) => setFormData({ ...formData, is_tax_exempt: e.target.checked })}
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Tax Exempt</span>
                      <span className="block text-xs text-gray-500">Exclude from automated tax (4x1000)</span>
                    </div>
                  </label>

                  {/* Liquid Asset Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${formData.is_liquid ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover:border-blue-500'}`}>
                      {formData.is_liquid && <ShieldCheck size={16} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.is_liquid}
                      onChange={(e) => setFormData({ ...formData, is_liquid: e.target.checked })}
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Liquid Asset</span>
                      <span className="block text-xs text-gray-500">Available immediately (e.g. Cash)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Configurations */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs">3</span>
                Fees & Taxes
              </h4>
              <div className="pl-8">
                <AccountConfigForm
                  configurations={configurations}
                  onChange={setConfigurations}
                  currencyCode={formData.currency_code}
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
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
          <div key={account.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-primary/20 relative overflow-hidden flex flex-col justify-between">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${account.type === 'Checking' ? 'bg-blue-500' :
              account.type === 'Savings' ? 'bg-green-500' :
                account.type === 'Credit Card' ? 'bg-purple-500' :
                  'bg-gray-400'
              }`}></div>

            <div>
              <div className="flex justify-between items-start mb-4 pl-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{account.type}</p>
                    {account.is_tax_exempt && (
                      <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-100 flex items-center gap-1">
                        <ShieldCheck size={10} /> Exempt
                      </span>
                    )}
                    {account.is_liquid && (
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                        Liquid
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 truncate pr-2">{account.name}</h3>
                </div>
                <button
                  onClick={() => handleEdit(account)}
                  className="p-2.5 text-gray-500 bg-gray-100 rounded-full transition-all md:opacity-50 md:group-hover:opacity-100 md:hover:text-primary md:hover:bg-primary/10 md:bg-gray-500/5 md:rounded-lg cursor-pointer"
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
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm font-medium text-gray-400">{account.currency_code}</p>
                  {account.interest_rate !== undefined && account.interest_rate > 0 && (
                    <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Percent size={10} /> {account.interest_rate}% E.A
                    </span>
                  )}
                </div>
              </div>
            </div>

            {account.configurations && account.configurations.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-2 pl-3">
                <div className="flex items-center gap-2 mb-2">
                  <Settings size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fees & Taxes</span>
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
