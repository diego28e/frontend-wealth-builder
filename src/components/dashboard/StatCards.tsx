import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Transaction, UserBalance } from '../../types/api';
import { useMemo } from 'react';

interface StatCardsProps {
  transactions: Transaction[];
  balance: UserBalance | null;
}

export default function StatCards({ transactions, balance }: StatCardsProps) {
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((tx) => tx.type === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpenses = transactions
      .filter((tx) => tx.type === 'Expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const currencyCode = balance?.starting_balance_currency_code || 'COP';
    const currentBalance = balance?.current_calculated_balance ?? 0;
    const startingBalance = balance?.starting_balance ?? 0;

    return [
      {
        label: 'Total Balance',
        value: `${currencyCode} ${currentBalance.toLocaleString()}`,
        change: `From ${currencyCode} ${startingBalance.toLocaleString()}`,
        trend: 'neutral' as const,
        icon: DollarSign,
      },
      {
        label: 'Income',
        value: `${currencyCode} ${totalIncome.toLocaleString()}`,
        change: 'This period',
        trend: 'up' as const,
        icon: TrendingUp,
      },
      {
        label: 'Expenses',
        value: `${currencyCode} ${totalExpenses.toLocaleString()}`,
        change: 'This period',
        trend: 'down' as const,
        icon: TrendingDown,
      },
    ];
  }, [transactions, balance]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-surface-light rounded-xl p-6 border border-border-color shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-text-secondary">
                {stat.label}
              </span>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-text-main mb-2">
              {stat.value}
            </div>
            <div
              className={`text-sm font-medium ${
                stat.trend === 'up'
                  ? 'text-green-600'
                  : stat.trend === 'down'
                  ? 'text-red-600'
                  : 'text-text-secondary'
              }`}
            >
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
