export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your financial health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Balance</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">$12,450.00</div>
          <div className="text-sm text-green-600 mt-2">+12.5% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Income</div>
          <div className="text-3xl font-bold text-green-600 mt-2">$8,200.00</div>
          <div className="text-sm text-gray-600 mt-2">This month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Expenses</div>
          <div className="text-3xl font-bold text-red-600 mt-2">$3,750.00</div>
          <div className="text-sm text-gray-600 mt-2">This month</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[
            { name: 'Salary Deposit', amount: 5000, type: 'income', date: 'Today' },
            { name: 'Grocery Shopping', amount: -120.50, type: 'expense', date: 'Yesterday' },
            { name: 'Freelance Project', amount: 1500, type: 'income', date: '2 days ago' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-gray-900">{tx.name}</div>
                <div className="text-sm text-gray-500">{tx.date}</div>
              </div>
              <div className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
