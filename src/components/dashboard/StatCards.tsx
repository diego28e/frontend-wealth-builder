import { DollarSign, Wallet, CreditCard } from 'lucide-react';
import type { Transaction, UserBalance } from '../../types/api';
import { useAuth } from '../../contexts/AuthContext';
import { fromCents } from '../../lib/currency';

interface StatCardsProps {
  transactions: Transaction[];
  balance: UserBalance | null;
}

export default function StatCards({ transactions, balance }: StatCardsProps) {
  const { user } = useAuth();

  // Calculate total income and expense from transactions (this month)
  const totals = transactions.reduce((acc, t) => {
    const amount = fromCents(t.amount);
    if (t.type === 'Income') acc.income += amount;
    else if (t.type === 'Expense') acc.expense += amount;
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Net Worth Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Wallet size={20} />
          </div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Net Worth</span>
        </div>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {fromCents(balance?.net_worth ?? 0).toLocaleString('en-US', {
            style: 'currency',
            currency: balance?.currency_code || user?.default_currency || 'COP',
          })}
        </p>
        <p className="text-xs text-gray-400 mt-2 font-medium">Total assets across all accounts</p>
      </div>

      {/* Liquid Balance Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <DollarSign size={20} />
          </div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Liquid Balance</span>
        </div>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {fromCents(balance?.liquid_balance ?? 0).toLocaleString('en-US', {
            style: 'currency',
            currency: balance?.currency_code || user?.default_currency || 'COP',
          })}
        </p>
        <p className="text-xs text-gray-400 mt-2 font-medium">Available for immediate spending</p>
      </div>

      {/* Monthly Spending Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <CreditCard size={20} />
          </div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Monthly Spend</span>
        </div>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {totals.expense.toLocaleString('en-US', {
            style: 'currency',
            currency: balance?.currency_code || user?.default_currency || 'COP',
          })}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${totals.income > totals.expense ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {totals.income > 0 ? ((totals.expense / totals.income) * 100).toFixed(0) : 0}% of income
          </div>
          <span className="text-xs text-gray-400 font-medium">used</span>
        </div>
      </div>
    </div>
  );
}
