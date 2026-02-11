import { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useCurrencies } from '../../hooks/useCurrencies';
import { toCents } from '../../lib/currency';
import type { CreateFinancialGoalRequest } from '../../types/api';

interface NewGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateFinancialGoalRequest) => Promise<void>;
    userId: string;
}

export function NewGoalModal({ isOpen, onClose, onSave, userId }: NewGoalModalProps) {
    const { currencies } = useCurrencies();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        currency_code: 'COP'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                user_id: userId,
                name: formData.name,
                description: formData.description,
                target_amount: toCents(formData.target_amount),
                current_amount: formData.current_amount ? toCents(formData.current_amount) : 0,
                target_date: formData.target_date,
                currency_code: formData.currency_code
            });
            onClose();
            // Reset form
            setFormData({
                name: '',
                description: '',
                target_amount: '',
                current_amount: '',
                target_date: '',
                currency_code: 'COP'
            });
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
                             <Target size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">New Financial Goal</h3>
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
                            placeholder="e.g. New House, Vacation to Japan"
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
                                    placeholder="0.00"
                                    className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.target_amount}
                                    onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                            <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                value={formData.currency_code}
                                onChange={e => setFormData({ ...formData, currency_code: e.target.value })}
                            >
                                {currencies.map(c => (
                                    <option key={c.code} value={c.code}>{c.code}</option>
                                ))}
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
                                    placeholder="0.00"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
                        <textarea
                            rows={3}
                            placeholder="Why is this goal important?"
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
                            {isSubmitting ? 'Creating...' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
