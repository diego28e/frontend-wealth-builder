import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import StatCards from '../components/dashboard/StatCards';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import {BudgetBreakdown} from '../components/dashboard/BudgetBreakdown';
import { useCategoryGroupSummary } from '../hooks/useCategoryGroupSummary';
import InsightsCard from '../components/dashboard/InsightsCard';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../contexts/AuthContext';
import {useNavigate} from '@tanstack/react-router';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const { startDate, endDate } = useMemo(() => {
  const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}, [selectedDate]);

const { transactions, isLoading: transactionsLoading } = useTransactions(user?.id, startDate, endDate);
const { balance, isLoading: balanceLoading } = useBalance();
const { summary, isLoading: summaryLoading } = useCategoryGroupSummary(user?.id, startDate, endDate);
const { getCategoryName } = useCategories();

const monthLabel = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  if (transactionsLoading || balanceLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }
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
          <div className="flex items-center gap-2 bg-surface-light border border-border-color rounded-xl px-2 py-1">
            <button onClick={handlePreviousMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button onClick={handleCurrentMonth} className="px-3 py-1.5 text-sm font-bold text-text-main hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
              <Calendar size={14} className="text-gray-500" />
              {monthLabel}
            </button>
            <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
          <button onClick={() => navigate({to:'/transactions'})} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/30 hover:bg-primary-hover transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer">
            <Plus size={18} strokeWidth={3} />
            Add Transaction
          </button>
        </div>
      </div>

      <StatCards transactions={transactions} balance={balance} />

      {/* Budget Breakdown & Insights */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <BudgetBreakdown summary={summary} />
        </div>
        <div className='lg:col-span-1'>
          <InsightsCard />
        </div>
      </div>


      <TransactionsTable transactions={transactions} getCategoryName={getCategoryName} />

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-400 font-medium">
        <p>© {new Date().getFullYear()} Wealth Builder. All rights reserved.</p>
      </footer>
    </div>
  );
}
