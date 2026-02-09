import { useMemo } from 'react';
import type { CategoryGroupSummary } from '../../types/api';

interface BudgetBreakdownProps {
  summary: CategoryGroupSummary[];
}

export function BudgetBreakdown({ summary }: BudgetBreakdownProps) {
  const breakdown = useMemo(() => {
    const expenses = summary.filter(s => s.category_group_name !== 'Income');
    const totalExpenses = expenses.reduce((sum, s) => sum + Math.abs(s.total_amount), 0);

    const getAmount = (name: string) => 
      Math.abs(summary.find(s => s.category_group_name === name)?.total_amount || 0);

    return {
      needs: getAmount('Needs'),
      wants: getAmount('Wants'),
      savings: getAmount('Savings'),
      total: totalExpenses,
    };
  }, [summary]);

  const getPercentage = (amount: number) => 
    breakdown.total > 0 ? (amount / breakdown.total) * 100 : 0;

  const getStatusColor = (actual: number, target: number) => {
    const diff = Math.abs(actual - target);
    if (diff <= 5) return 'text-green-600';
    if (diff <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const items = [
    { label: 'Needs', amount: breakdown.needs, target: 50, color: 'bg-blue-500' },
    { label: 'Wants', amount: breakdown.wants, target: 30, color: 'bg-purple-500' },
    { label: 'Savings', amount: breakdown.savings, target: 20, color: 'bg-green-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Budget Breakdown</h2>
      <div className="space-y-4">
        {items.map(({ label, amount, target, color }) => {
          const actual = getPercentage(amount);
          return (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{label}</span>
                <span className={`text-sm font-semibold ${getStatusColor(actual, target)}`}>
                  {actual.toFixed(1)}% / {target}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(actual, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
