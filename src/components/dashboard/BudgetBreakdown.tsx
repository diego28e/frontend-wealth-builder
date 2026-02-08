import { PieChart } from 'lucide-react';
import type { Transaction } from '../../types/api';
import { useMemo } from 'react';

interface BudgetBreakdownProps {
  transactions: Transaction[];
  getCategoryName: (categoryId: string) => string;
}

export default function BudgetBreakdown({ transactions, getCategoryName }: BudgetBreakdownProps) {
  // Calculate spending by category from transactions
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    let totalExpenses = 0;

    // Only include expenses (negative amounts or type === 'Expense')
    transactions
      .filter((tx) => tx.type === 'Expense')
      .forEach((tx) => {
        const categoryName = getCategoryName(tx.category_id);
        const amount = Math.abs(tx.amount);
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
        totalExpenses += amount;
      });

    // Color palette for categories
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-gray-500',
    ];

    // Convert map to array and calculate percentages
    return Array.from(categoryMap.entries())
      .map(([name, amount], index) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  }, [transactions, getCategoryName]);

  if (categories.length === 0) {
    return (
      <div className="bg-surface-light rounded-xl border border-border-color p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-text-main">Budget Breakdown</h3>
            <p className="text-sm text-text-secondary mt-1">Spending by category</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <PieChart size={20} className="text-primary mx-auto" />
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-text-secondary">No expense data available yet.</p>
        </div>
      </div>
    );
  }

    return(
        <div className='bg-surface-light rounded-xl border border-border-color p-6'>
            <div className='flex items-center justify-between mb-6'>
            <div>
                <h3 className="text-xl font-semibold text-text-main">Budget Breakdown</h3>
                <p className="text-sm text-text-secondary mt-1">Spending by category</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieChart size={20} className="text-primary mx-auto"/>
            </div>
            </div>
            <div className="space-y-4">
                {categories.map((category)=>(
                    <div key={category.name}>
                        <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-text-main'>{category.name}</span>
                        <span className='text-sm font-semibold text-text-main'>${category.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${category.color} h-2 rounded-full transition-all duration-500 ease-out`}
                            style={{width:`${category.percentage}%`}}>

                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}