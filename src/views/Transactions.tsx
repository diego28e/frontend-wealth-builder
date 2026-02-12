import { useState } from 'react';
import { Plus, ScanLine, DollarSign, Calendar, Tag, Filter, ChevronDown } from 'lucide-react';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';
import { TransactionSidebar } from '../components/transactions/TransactionSidebar';

import { TransactionDetailsModal } from '../components/transactions/TransactionDetailsModal';
import type { Transaction } from '../types/api';

export default function Transactions() {
  const { user } = useAuth();
  
  // Default to fetching the current year's transactions to avoid backend truncation of "recent" items
  // which might happen with unbounded queries.
  const { startDate, endDate } = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1); // Jan 1st
    const end = new Date(now.getFullYear(), 11, 31); // Dec 31st
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  })[0];

  const { transactions, isLoading, error } = useTransactions(user?.id, startDate, endDate);
  const { getCategoryName } = useCategories();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Extract unique currencies from transactions
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const availableCurrencies = Array.from(new Set(safeTransactions.map(t => t.currency_code)));

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

  const filteredTransactions = safeTransactions.filter(t => {
      // Filter by currency
      if (selectedCurrency !== 'ALL' && t.currency_code !== selectedCurrency) return false;
      return true;
  });

  const sortedTransactions = Array.isArray(filteredTransactions) 
      ? [...filteredTransactions].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      })
      : [];

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
        <div className="relative">
            {isCurrencyOpen && (
              <div 
                className="fixed inset-0 z-0 bg-transparent"
                onClick={() => setIsCurrencyOpen(false)} 
              />
            )}
            <button 
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="relative z-10 flex items-center gap-2 px-4 py-2 bg-surface-light border border-border-color rounded-xl text-sm font-medium hover:border-primary transition-colors text-text-secondary shadow-sm group"
            >
              <DollarSign size={18} className={`text-gray-400 transition-colors ${isCurrencyOpen ? 'text-primary' : 'group-hover:text-primary'}`} />
              Currency: <span className="text-text-main font-bold ml-1">{selectedCurrency === 'ALL' ? 'All' : selectedCurrency}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCurrencyOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { setSelectedCurrency('ALL'); setIsCurrencyOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCurrency === 'ALL' ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                  >
                    All Currencies
                  </button>
                  {availableCurrencies.map(currency => (
                    <button 
                      key={currency}
                      onClick={() => { setSelectedCurrency(currency); setIsCurrencyOpen(false); }} 
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCurrency === currency ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                    >
                      {currency}
                    </button>
                  ))}
              </div>
            )}
        </div>
        
        <div className="relative">
            {isSortOpen && (
              <div 
                className="fixed inset-0 z-0 bg-transparent"
                onClick={() => setIsSortOpen(false)} 
              />
            )}
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="relative z-10 flex items-center gap-2 px-4 py-2 bg-surface-light border border-border-color rounded-xl text-sm font-medium hover:border-primary transition-colors text-text-secondary shadow-sm group"
            >
              <Calendar size={18} className={`text-gray-400 transition-colors ${isSortOpen ? 'text-primary' : 'group-hover:text-primary'}`} />
              Sort: <span className="text-text-main font-bold ml-1">{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSortOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortOrder === 'newest' ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                  >
                    Newest First
                  </button>
                  <button 
                    onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortOrder === 'oldest' ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                  >
                    Oldest First
                  </button>
              </div>
            )}
        </div>

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
        <TransactionsTable 
          transactions={sortedTransactions} 
          getCategoryName={getCategoryName} 
          onTransactionClick={setSelectedTransaction}
        />
      </div>

      <TransactionSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSuccess={handleSuccess}
      />
      
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        getCategoryName={getCategoryName}
      />
    </div>
  );
}
