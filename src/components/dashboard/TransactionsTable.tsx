import {ArrowUpRight, ArrowDownRight} from 'lucide-react';

export default function TransactionsTable() {

    const transactions = [
        {
            id:'1',
            description: 'Salary Deposit',
            merchant: 'OCW',
            amount: 5000,
            type: 'Income' as const,
            date: '2026-02-01',
            category: 'Salary',
        },
    {
      id: '2',
      description: 'Grocery Shopping',
      merchant: 'Supermarket',
      amount: -120.50,
      type: 'Expense' as const,
      date: '2024-02-07',
      category: 'Food',
    },
    {
      id: '3',
      description: 'Freelance Project',
      merchant: 'Client XYZ',
      amount: 1500,
      type: 'Income' as const,
      date: '2024-02-06',
      category: 'Freelance',
    },
    {
      id: '4',
      description: 'Electric Bill',
      merchant: 'Utility Co.',
      amount: -85.00,
      type: 'Expense' as const,
      date: '2024-02-05',
      category: 'Utilities',
    },
    ]
    return (
    <div className="bg-surface-light rounded-xl border border-border-color overflow-hidden">
      <div className="p-6 border-b border-border-color">
        <h3 className="text-xl font-semibold text-text-main">Recent Transactions</h3>
        <p className="text-sm text-text-secondary mt-1">Your latest financial activity</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border-color">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'Income'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {tx.type === 'Income' ? (
                        <ArrowUpRight size={20} />
                      ) : (
                        <ArrowDownRight size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-text-main">{tx.description}</div>
                      <div className="text-sm text-text-secondary">{tx.merchant}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {new Date(tx.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}