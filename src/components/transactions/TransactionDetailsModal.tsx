import { X, Calendar, CreditCard, Tag, Store, DollarSign, Receipt } from 'lucide-react';
import type { Transaction } from '../../types/api';
import { fromCents, formatCurrency } from '../../lib/currency';

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  getCategoryName: (id: string) => string;
}

export function TransactionDetailsModal({ transaction, isOpen, onClose, getCategoryName }: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Main Amount & Merchant */}
            <div className="text-center">
               <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                 transaction.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
               }`}>
                 <DollarSign size={32} />
               </div>
               <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
                 {transaction.type === 'Income' ? '+' : '-'}{transaction.currency_code} {formatCurrency(fromCents(Math.abs(transaction.amount)))}
               </h3>
               <p className="text-lg text-gray-600 font-medium">{transaction.merchant_name || transaction.description}</p>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                  <Tag size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{getCategoryName(transaction.category_id)}</p>
                </div>
              </div>

               <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Type</p>
                  <p className={`text-sm font-semibold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type}
                  </p>
                </div>
              </div>

              {transaction.description && transaction.description !== transaction.merchant_name && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                    <Store size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Description</p>
                    <p className="text-sm font-semibold text-gray-900">{transaction.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Line Items Section */}
            {transaction.has_line_items && transaction.transaction_items && transaction.transaction_items.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={18} className="text-primary" />
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Receipt Items</h4>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Item</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-right">Qty</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-right">Price</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transaction.transaction_items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{item.item_name}</td>
                          <td className="px-4 py-3 text-gray-600 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-gray-600 text-right">
                             {formatCurrency(fromCents(item.unit_price))}
                          </td>
                          <td className="px-4 py-3 text-gray-900 font-bold text-right">
                             {formatCurrency(fromCents(item.total_amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 font-bold text-gray-900 text-right">Total</td>
                        <td className="px-4 py-3 font-bold text-gray-900 text-right">
                           {formatCurrency(fromCents(transaction.amount))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
