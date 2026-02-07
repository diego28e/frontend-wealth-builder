import { Link } from '@tanstack/react-router';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to WealthBuilder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered financial companion
        </p>
        <Link
          to="/dashboard"
          className="inline-block border-emerald-600 border-2 text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 hover:text-white transition-colors transition-all duration-300"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-emerald-600 text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Expenses</h3>
          <p className="text-gray-600">Monitor your spending habits and stay on budget</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-emerald-600 text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
          <p className="text-gray-600">Get personalized financial recommendations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-emerald-600 text-3xl mb-3">💰</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Grow Wealth</h3>
          <p className="text-gray-600">Build better financial habits for the future</p>
        </div>
      </div>
    </div>
  );
}
