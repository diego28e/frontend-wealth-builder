import { TrendingUp, Activity, Lightbulb } from 'lucide-react';

// Mock types for now until real AI integration
interface TimelineEvent {
    year: number;
    amount: number;
    description: string;
}

interface GoalSidebarProps {
    insight: string;
    timeline: TimelineEvent[];
    loading?: boolean;
    onRefresh?: () => void;
}

export function GoalSidebar({ insight, timeline, loading, onRefresh }: GoalSidebarProps) {
  return (
    <aside className="hidden xl:flex flex-col w-80 bg-white border-l border-border-color h-full overflow-y-auto p-6 fixed right-0 top-0 pt-20 z-0">
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={20} />
                Wealth Forecast
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {loading ? (
                        <span className="animate-pulse">Analyzing your financial trajectory...</span>
                    ) : (
                        insight || "Add goals to generate a wealth forecast. Based on your current trajectory, you are on track to meet your primary savings targets."
                    )}
                </p>
                {onRefresh && (
                    <button 
                        onClick={onRefresh}
                        className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                        disabled={loading}
                    >
                        <Activity size={14} /> Refresh Analysis
                    </button>
                )}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                Projected Timeline
            </h3>
            
            <div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-8">
                {timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary" />
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full mb-1 inline-block">
                            {event.year}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">{event.description}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Est. Balance: ${event.amount.toLocaleString()}
                        </p>
                    </div>
                ))}
                
                {timeline.length === 0 && !loading && (
                    <div className="text-sm text-gray-400 italic">No events projected yet.</div>
                )}
            </div>
        </div>
    </aside>
  );
}
