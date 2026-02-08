import { Calendar, Plus } from 'lucide-react';
import StatCards from '../components/dashboard/StatCards';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import BudgetBreakdown from '../components/dashboard/BudgetBreakdown';
import InsightsCard from '../components/dashboard/InsightsCard';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, isLoading, error } = useTransactions();
  const { getCategoryName } = useCategories();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-main">Dashboard</h2>
          <p className="text-text-secondary mt-1 font-medium">
            Welcome back, {user?.first_name || ''}. Here is your financial health at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-surface-light border border-border-color rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-text-main">
            <Calendar size={16} className="text-gray-500" />
            Oct 2023
          </button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/30 hover:bg-primary-hover transition-all flex items-center gap-2 transform active:scale-95">
            <Plus size={18} strokeWidth={3} />
            Add Transaction
          </button>
        </div>
      </div>

      <StatCards />

      {/* Budget Breakdown & Insights */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <BudgetBreakdown transactions={transactions} getCategoryName={getCategoryName} />
        </div>
        <div className='lg:col-span-1'>
          <InsightsCard />
        </div>
      </div>


      <TransactionsTable transactions={transactions} getCategoryName={getCategoryName} />

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-400 font-medium">
        <p>© 2024 Wealth Builder. All rights reserved.</p>
      </footer>
    </div>
  );
}
