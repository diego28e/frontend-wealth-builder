import { useMemo } from 'react';
import type { CategoryGroupSummary } from '../../types/api';

interface BudgetBreakdownProps {
  summary: CategoryGroupSummary[];
}

export function BudgetBreakdown({ summary }: BudgetBreakdownProps) {
  const breakdown = useMemo(() => {
    const income = Math.abs(summary.find(s => s.category_group_name === 'Income')?.total_amount || 0);
    const getAmount = (name: string) => 
      Math.abs(summary.find(s => s.category_group_name === name)?.total_amount || 0);

    return {
      needs: getAmount('Needs'),
      wants: getAmount('Wants'),
      savings: getAmount('Savings'),
      income,
    };
  }, [summary]);

  const getPercentage = (amount: number) => 
    breakdown.income > 0 ? (amount / breakdown.income) * 100 : 0;

  const getStatus = (actual: number, target: number, label: string) => {
    // Calculate utilization percentage relative to the target
    // e.g., if actual is 30% and target is 30%, utilization is 100%
    const utilization = target > 0 ? (actual / target) * 100 : 0;
    
    // For Savings, having more is better (or matching target)
    if (label === 'Savings') {
       if (utilization >= 100) return { color: 'bg-green-500', textColor: 'text-green-600' };
       if (utilization >= 50) return { color: 'bg-yellow-500', textColor: 'text-yellow-600' };
       return { color: 'bg-blue-500', textColor: 'text-blue-600' }; // Neutral/In Progress
    }

    // For Needs/Wants, staying under is better
    if (utilization > 100) return { color: 'bg-red-500', textColor: 'text-red-600' };
    if (utilization > 85) return { color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const items = [
    { label: 'Needs', amount: breakdown.needs, target: 50 },
    { label: 'Wants', amount: breakdown.wants, target: 30 },
    { label: 'Savings', amount: breakdown.savings, target: 20 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Budget Breakdown</h2>
      <div className="space-y-4">
        {items.map(({ label, amount, target }) => {
          const actual = getPercentage(amount);
          const utilization = target > 0 ? (actual / target) * 100 : 0;
          const status = getStatus(actual, target, label);
          
          return (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{label}</span>
                <span className={`text-sm font-semibold ${status.textColor}`}>
                  {actual.toFixed(1)}% / {target}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${status.color} h-2 rounded-full transition-all duration-500`} 
                  style={{ width: `${Math.min(utilization, 100)}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
