import { Plus, X } from 'lucide-react';
import type { AccountConfiguration, ConfigurationType, ConfigurationFrequency, ConfigurationAppliesTo } from '../../types/api';

interface AccountConfigFormProps {
  configurations: AccountConfiguration[];
  onChange: (configs: AccountConfiguration[]) => void;
  currencyCode: string;
}

export function AccountConfigForm({ configurations, onChange, currencyCode }: AccountConfigFormProps) {
  const addConfig = () => {
    onChange([...configurations, {
      name: '',
      type: 'PERCENTAGE',
      value: 0,
      frequency: 'PER_TRANSACTION',
      applies_to: 'EXPENSE',
    }]);
  };

  const updateConfig = (index: number, field: keyof AccountConfiguration, value: any) => {
    const updated = [...configurations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeConfig = (index: number) => {
    onChange(configurations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Fees & Taxes (Optional)</label>
        <button
          type="button"
          onClick={addConfig}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          <Plus size={14} /> Add Fee
        </button>
      </div>

      {configurations.map((config, index) => (
        <div key={index} className="border rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="flex justify-between items-start gap-2">
            <input
              type="text"
              placeholder="Fee name (e.g., GMF 4x1000)"
              value={config.name}
              onChange={(e) => updateConfig(index, 'name', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
            />
            <button
              type="button"
              onClick={() => removeConfig(index)}
              className="text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={config.type}
              onChange={(e) => updateConfig(index, 'type', e.target.value as ConfigurationType)}
              className="px-2 py-1 text-sm border rounded"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed Amount</option>
            </select>
            
            <input
              type="number"
              step={config.type === 'PERCENTAGE' ? '0.01' : '1'}
              placeholder={config.type === 'PERCENTAGE' ? '0.4' : '15000'}
              value={config.value || ''}
              onChange={(e) => updateConfig(index, 'value', parseFloat(e.target.value) || 0)}
              className="px-2 py-1 text-sm border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={config.frequency}
              onChange={(e) => updateConfig(index, 'frequency', e.target.value as ConfigurationFrequency)}
              className="px-2 py-1 text-sm border rounded"
            >
              <option value="PER_TRANSACTION">Per Transaction</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ANNUAL">Annual</option>
              <option value="ONE_TIME">One Time</option>
            </select>

            <select
              value={config.applies_to || 'ALL'}
              onChange={(e) => updateConfig(index, 'applies_to', e.target.value as ConfigurationAppliesTo)}
              className="px-2 py-1 text-sm border rounded"
            >
              <option value="ALL">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="BALANCE">Balance</option>
            </select>
          </div>

          {config.type === 'FIXED' && (
            <input
              type="text"
              value={config.currency_code || currencyCode}
              onChange={(e) => updateConfig(index, 'currency_code', e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded"
              placeholder="Currency (optional)"
            />
          )}
        </div>
      ))}
    </div>
  );
}
