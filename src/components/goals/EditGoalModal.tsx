import { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { toCents, fromCents } from '../../lib/currency';
import type { FinancialGoal, UpdateFinancialGoalRequest } from '../../types/api';

interface EditGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: UpdateFinancialGoalRequest) => Promise<void>;
    goal: FinancialGoal | null;
}

export function EditGoalModal({ isOpen, onClose, onSave, goal }: EditGoalModalProps) {
    const { categories } = useCategories();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Initialize with safe defaults, update when goal changes
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        status: 'ACTIVE' as 'ACTIVE' | 'COMPLETED' | 'ARCHIVED',
        category_id: ''
    });

    useEffect(() => {
        if (goal) {
            setFormData({
                name: goal.name,
                description: goal.description || '',
                target_amount: fromCents(goal.target_amount).toString(),
                current_amount: fromCents(goal.current_amount).toString(),
                target_date: new Date(goal.target_date).toISOString().split('T')[0],
                status: goal.status || 'ACTIVE',
                category_id: goal.category_id || ''
            });
        }
    }, [goal]);

    if (!isOpen || !goal) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(goal.id, {
                user_id: goal.user_id,
                name: formData.name,
                description: formData.description,
                target_amount: toCents(formData.target_amount),
                current_amount: toCents(formData.current_amount),
                target_date: formData.target_date,
                status: formData.status,
                category_id: formData.category_id || undefined
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             <Pencil size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Edit Goal</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Goal Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.target_amount}
                                    onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                            <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Saved</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.current_amount}
                                    onChange={e => setFormData({ ...formData, current_amount: e.target.value })}
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.target_date}
                                onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                        <select
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                            value={formData.category_id}
                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="">Select a category (Optional)</option>
                             {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {isSubmitting ? 'Save Changes' : 'Update Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
