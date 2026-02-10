import { useState } from 'react';
import { Plus, ScanLine, DollarSign, Calendar, Tag, Filter, ChevronDown } from 'lucide-react';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';
import { TransactionSidebar } from '../components/transactions/TransactionSidebar';

export default function Transactions() {
  const { user } = useAuth();
  const { transactions, isLoading, error } = useTransactions(user?.id);
  const { getCategoryName } = useCategories();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Success handler to refresh data could be added here if useTransactions exposed a refetch method
  // For now, we'll just close the sidebar. In a real app, query invalidation (React Query) would handle this automatically.
  // or we can add a refresh trigger to useTransactions.
  const handleSuccess = () => {
    // Ideally trigger a refetch here. 
    // Since useTransactions depends on userId/dates, we might need a force refresh mechanism 
    // or just let the user see the update on next mount/focus if we had React Query.
    // Given the current hook implementation, a simple reload of the page or context update might be needed 
    // but the hook will re-run if we change any dependency. 
    // For now, we simply close the sidebar. The user might need to refresh or we can add a refresh Key.
    // Actually, let's just reload the page for now as the simplest "refetch" if we don't change the hook.
    // Or better, let's update the hook to return a refetch function (it doesn't currently).
    // I'll leave it as is for now, but note that the list might not update immediately without a refresh.
    // Wait, useAccounts has refetch, useTransactions does not. I should probably add it later.
    window.location.reload(); 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-500">Error loading transactions: {error}</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main mb-2">Transaction Management</h1>
          <p className="text-text-secondary">Track expenses, manage budgets, and scan receipts with AI.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Budget Health (Visual Only) */}
          <div className="hidden xl:flex items-center gap-2 mr-6 bg-surface-light px-4 py-2 rounded-xl shadow-sm border border-border-color">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Budget Health</span>
            <div className="flex h-2 w-32 rounded-full overflow-hidden bg-gray-100">
              <div className="w-1/2 bg-blue-500" title="Needs"></div>
              <div className="w-[30%] bg-purple-500" title="Wants"></div>
              <div className="w-[20%] bg-primary" title="Savings"></div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-green-500/30 flex items-center gap-2 transition-all transform active:scale-95 lg:hidden"
          >
            <Plus size={20} />
            Add
          </button>
          
          {/* Desktop Buttons */}
          <button 
             onClick={() => setIsSidebarOpen(true)}
             className="hidden lg:flex bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-green-500/30 items-center gap-2 transition-all transform active:scale-95"
          >
             <ScanLine size={20} />
             Add Transaction
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border-color rounded-xl text-sm font-medium hover:border-primary transition-colors text-text-secondary shadow-sm group">
          <DollarSign size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
          Currency: <span className="text-text-main font-bold ml-1">USD</span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border-color rounded-xl text-sm font-medium hover:border-primary transition-colors text-text-secondary shadow-sm group">
          <Calendar size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
          Date: <span className="text-text-main font-bold ml-1">This Month</span>
           <ChevronDown size={16} className="text-gray-400" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border-color rounded-xl text-sm font-medium hover:border-primary transition-colors text-text-secondary shadow-sm group">
          <Tag size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
          Category: <span className="text-text-main font-bold ml-1">All</span>
           <ChevronDown size={16} className="text-gray-400" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border-color rounded-xl text-sm font-medium hover:border-primary transition-colors text-text-secondary shadow-sm ml-auto group">
          <Filter size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
          More Filters
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <TransactionsTable transactions={transactions} getCategoryName={getCategoryName} />
      </div>

      <TransactionSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}
