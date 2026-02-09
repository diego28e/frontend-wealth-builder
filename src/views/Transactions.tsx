import { TransactionForm } from '../components/transactions/TransactionForm';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';

export default function Transactions() {
  const { transactions, isLoading } = useTransactions();
  const { getCategoryName } = useCategories();

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

  return (
    <div className="flex gap-6 h-full">
      {/* Left: Transactions List */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-main">Transactions</h2>
          <p className="text-text-secondary mt-1 font-medium">
            View and manage all your transactions
          </p>
        </div>

        <TransactionsTable transactions={transactions} getCategoryName={getCategoryName} />
      </div>

      {/* Right: Add Transaction Form */}
      <aside className="w-[380px] shrink-0 bg-surface-light border border-border-color rounded-xl p-6 h-fit sticky top-8">
        <h3 className="text-lg font-bold text-text-main mb-6">New Transaction</h3>
        <TransactionForm />
      </aside>
    </div>
  );
}
