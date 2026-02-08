import {TrendingUp, TrendingDown, DollarSign} from 'lucide-react';

export default function StatCards() {

    const stats = [
        {
            label: 'Total Balance',
            value: '$12,450.00',
            change: '+12.5%',
            trend: 'up' as const,
            icon: DollarSign,
        },
        {
            label: 'Income',
            value: '$8,200.00',
            change: 'This month',
            trend: 'neutral' as const,
            icon: TrendingUp,
        },
        {
            label: 'Expenses',
            value: '$3,750.00',
            change: '-8.2%',
            trend: 'down' as const,
            icon: TrendingDown,
        },
    ]
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-surface-light rounded-xl p-6 border border-border-color shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-text-secondary">
                {stat.label}
              </span>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-text-main mb-2">
              {stat.value}
            </div>
            <div
              className={`text-sm font-medium ${
                stat.trend === 'up'
                  ? 'text-green-600'
                  : stat.trend === 'down'
                  ? 'text-red-600'
                  : 'text-text-secondary'
              }`}
            >
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}