import { useState, useRef, useEffect } from 'react';
import { Target, Calendar, TrendingUp, AlertCircle, MoreVertical, Pencil, Trash2, CheckCircle, Archive } from 'lucide-react';
import type { FinancialGoal } from '../../types/api';
import { fromCents } from '../../lib/currency';

interface GoalCardProps {
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goalId: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const progress = Math.min(100, Math.max(0, (goal.current_amount / goal.target_amount) * 100));
  const isCompleted = progress >= 100 || goal.status === 'COMPLETED';
  
  const formattedDate = new Date(goal.target_date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  });

  const daysUntil = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil < 30 && !isCompleted && goal.status === 'ACTIVE';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = () => {
      if (goal.status === 'COMPLETED') {
          return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Completed</span>
      }
      if (goal.status === 'ARCHIVED') {
          return <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Archive size={10} /> Archived</span>
      }
      return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full group relative overflow-visible">
        {/* Progress Bar Background */}
        <div 
            className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-1000 rounded-bl-2xl" 
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
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{goal.name}</h3>
                {getStatusBadge()}
            </div>
            {goal.description && <p className="text-xs text-gray-500 line-clamp-1">{goal.description}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            {isUrgent && (
                <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> {daysUntil} days
                </span>
            )}
            
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <MoreVertical size={18} />
                </button>
                
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => { onEdit(goal); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Pencil size={14} /> Edit
                        </button>
                        <button 
                            onClick={() => { onDelete(goal.id); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
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
