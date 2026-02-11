import { Target, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import type { FinancialGoal } from '../../types/api';
import { fromCents } from '../../lib/currency';

interface GoalCardProps {
  goal: FinancialGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = Math.min(100, Math.max(0, (goal.current_amount / goal.target_amount) * 100));
  const isCompleted = progress >= 100;
  
  // improved date formatting
  const formattedDate = new Date(goal.target_date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  });

  // Calculate if on track (simple logic: should have X% by now based on start date? 
  // For now, we'll just check if we have 0 progress and date is close)
  // Real implementation would compare current date vs start date vs target date.
  const daysUntil = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil < 30 && !isCompleted;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full group relative overflow-hidden">
        {/* Progress Bar Background (Optional subtle effect) */}
        <div 
            className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-1000" 
            style={{ width: `${progress}%` }} 
        />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
          }`}>
            {isCompleted ? <TrendingUp size={20} /> : <Target size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{goal.name}</h3>
            {goal.description && <p className="text-xs text-gray-500 line-clamp-1">{goal.description}</p>}
          </div>
        </div>
        
        {isUrgent && (
            <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <AlertCircle size={12} /> {daysUntil} days left
            </span>
        )}
      </div>

      <div className="space-y-4 flex-1">
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 font-medium">Progress</span>
                <span className="font-bold text-gray-900">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
             <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Saved</p>
                <p className="text-lg font-bold text-gray-900">
                    {fromCents(goal.current_amount).toLocaleString('en-US', { style: 'currency', currency: goal.currency_code })}
                </p>
             </div>
             <div className="text-right">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Target</p>
                <p className="text-sm font-semibold text-gray-700">
                    {fromCents(goal.target_amount).toLocaleString('en-US', { style: 'currency', currency: goal.currency_code })}
                </p>
             </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Calendar size={14} />
            <span>Target: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
