import { useState, useEffect } from 'react';
import { Plus, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { goalService } from '../services/goals';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalSidebar } from '../components/goals/GoalSidebar';
import { NewGoalModal } from '../components/goals/NewGoalModal';
import type { FinancialGoal, CreateFinancialGoalRequest } from '../types/api';

// Filters
type FilterType = 'Active' | 'Completed';

// Mock AI Data
const MOCK_INSIGHT = "Based on your current savings rate of $450/month across all goals, you are projected to hit your 'New House' down payment target 3 months ahead of schedule. Consider increasing your monthly contribution to 'Vacation' to meet the summer deadline.";

const MOCK_TIMELINE = [
    { year: 2024, amount: 12500, description: "Projected milestones: Emergency Fund complete." },
    { year: 2025, amount: 28000, description: "On track for: Vacation to Japan." },
    { year: 2026, amount: 45000, description: "Projected milestones: New House Down Payment." },
    { year: 2027, amount: 62000, description: "Wealth accumulation phase begins." },
];

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('Active');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
        fetchGoals();
    }
  }, [user?.id]);

  const fetchGoals = async () => {
    if (!user?.id) return;
    try {
        setLoading(true);
        const data = await goalService.getGoals(user.id);
        setGoals(data);
    } catch (error) {
        console.error("Failed to fetch goals", error);
    } finally {
        setLoading(false);
    }
  };

  const handleCreateGoal = async (data: CreateFinancialGoalRequest) => {
    try {
        await goalService.createGoal(data);
        await fetchGoals();
    } catch (error) {
        console.error("Failed to create goal", error);
        throw error; // Let modal handle error state if needed
    }
  };

  const handleRefreshAnalysis = () => {
    setAiLoading(true);
    // Simulate API call
    setTimeout(() => {
        setAiLoading(false);
    }, 1500);
  };

  const filteredGoals = goals.filter(goal => {
      const isCompleted = goal.current_amount >= goal.target_amount;
      if (filter === 'Active') return !isCompleted;
      if (filter === 'Completed') return isCompleted;
      return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-theme(spacing.20))]"> 
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-6 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Financial Goals</h2>
            <p className="text-gray-500 mt-1 font-medium">
                Set targets and track your progress to financial freedom.
            </p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all transform active:scale-95"
            >
                <Plus size={20} /> New Goal
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
            {(['Active', 'Completed'] as FilterType[]).map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                        filter === f 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>

        {/* Goals Grid */}
        {filteredGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-10">
                {filteredGoals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </div>
        ) : (
             <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Target className="text-gray-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {filter.toLowerCase()} goals found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    {filter === 'Active' ? "Start by creating a new financial goal to track your savings journey." : "You haven't completed any goals yet. Keep going!"}
                </p>
                {filter === 'Active' && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-primary font-bold hover:underline"
                    >
                        Create your first goal
                    </button>
                )}
            </div>
        )}
      </div>

      {/* Right Sidebar - AI Insights (Hidden on small screens) */}
      <div className="w-80 hidden xl:block shrink-0 relative">
         <GoalSidebar 
            insight={MOCK_INSIGHT} 
            timeline={MOCK_TIMELINE} 
            loading={aiLoading}
            onRefresh={handleRefreshAnalysis}
         />
      </div>

      {user && (
        <NewGoalModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleCreateGoal}
            userId={user.id} 
        />
      )}
    </div>
  );
}
