import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfileType } from '../types/api';
import { User, Mail, Lock, Briefcase, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    profile: 'Low-Income' as UserProfileType,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: formData.profile,
      });
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-500">Start your journey to financial freedom today.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              First Name
            </label>
            <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="John"
                required
                disabled={isSubmitting}
                />
            </div>
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Last Name
            </label>
             <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="Doe"
                required
                disabled={isSubmitting}
                />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email
          </label>
           <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="you@example.com"
                    required
                    disabled={isSubmitting}
                />
          </div>
        </div>

        {/* Profile Type */}
        <div>
          <label htmlFor="profile" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Financial Profile
          </label>
           <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                    id="profile"
                    name="profile"
                    value={formData.profile}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 appearance-none"
                    required
                    disabled={isSubmitting}
                >
                    <option value="Low-Income">Low-Income (Focus on essentials)</option>
                    <option value="High-Income/High-Expense">High-Income/High-Expense (Manage lifestyle)</option>
                    <option value="Wealth-Builder">Wealth-Builder (Grow savings)</option>
                </select>
                {/* Custom arrow could go here but default select arrow is usually fine or valid usage of CSS for appearance-none + background-image */}
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            This helps us personalize your experience. You can change this later.
          </p>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                minLength={8}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Confirm Password
          </label>
           <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                minLength={8}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 px-4 rounded-xl font-bold hover:bg-primary-hover transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
              <>
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 Creating account...
              </>
          ) : (
            <>
                Create Account <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
            Sign in
            </Link>
        </p>
      </div>
    </div>
  );
}
