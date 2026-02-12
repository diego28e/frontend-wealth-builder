import React from 'react';
import { useCategories } from '../../hooks/useCategories';

interface CategorySelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    error?: string;
}

export function CategorySelect({ value, onChange, placeholder = "Select Category", className = "", error, ...props }: CategorySelectProps) {
    const { categories, categoryGroups, isLoading } = useCategories();

    if (isLoading) {
        return (
            <select disabled className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 ${className}`} {...props}>
                <option>Loading categories...</option>
            </select>
        );
    }

    // Group categories by group ID
    const categoriesByGroup = categories.reduce((acc, cat) => {
        const groupId = cat.category_group_id || 'uncategorized';
        if (!acc[groupId]) acc[groupId] = [];
        acc[groupId].push(cat);
        return acc;
    }, {} as Record<string, typeof categories>);

    // Sort groups: Put "Income" first if it exists, "Expense" groups, then others.
    // For now, we utilize the order from categoryGroups array which should be reasonable.
    // We can also filter out groups that have no categories if we want, but let's keep it simple.

    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium text-gray-900 focus:ring-2 transition-all outline-none appearance-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                    } ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>

                {categoryGroups.map(group => {
                    const groupCategories = categoriesByGroup[group.id];
                    if (!groupCategories || groupCategories.length === 0) return null;

                    return (
                        <optgroup key={group.id} label={group.name}>
                            {groupCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </optgroup>
                    );
                })}

                {/* Handle Uncategorized or Orphaned Categories */}
                {categoriesByGroup['uncategorized']?.length > 0 && (
                    <optgroup label="Other">
                        {categoriesByGroup['uncategorized'].map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </optgroup>
                )}
            </select>
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
}
