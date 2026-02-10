import { Target } from 'lucide-react';

export default function Goals() {
  return (
    <div className="space-y-8">
       {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Financial Goals</h2>
          <p className="text-gray-500 mt-1 font-medium">
            Set targets and track your progress to financial freedom.
          </p>
        </div>
        <button disabled className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-full text-sm font-bold cursor-not-allowed">
            + New Goal
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <Target className="text-gray-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Goals Feature Coming Soon</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
            We are working hard to bring you smart goal tracking. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
