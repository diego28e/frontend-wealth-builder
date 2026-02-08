import {PieChart} from 'lucide-react';

export default function BudgetBreakdown() {

   const categories = [
    { name: 'Food & Dining', amount: 450, percentage: 35, color: 'bg-blue-500' },
    { name: 'Transportation', amount: 280, percentage: 22, color: 'bg-green-500' },
    { name: 'Utilities', amount: 220, percentage: 17, color: 'bg-yellow-500' },
    { name: 'Entertainment', amount: 180, percentage: 14, color: 'bg-purple-500' },
    { name: 'Other', amount: 150, percentage: 12, color: 'bg-gray-500' },
  ];

    return(
        <div className='bg-surface-light rounded-xl border border-border-color p-6'>
            <div className='flex items-center justify-between mb-6'>
            <div>
                <h3 className="text-xl font-semibold text-text-main">Budget Breakdown</h3>
                <p className="text-sm text-text-secondary mt-1">Spending by category</p>
            </div>
            <div className="w-10 h-10 round3ed-lg bg-primary/10 flex items-center jusitify-center">
                <PieChart size={20} className="text-primary mx-auto"/>
            </div>
            </div>
            <div className="space-y-4">
                {categories.map((category)=>(
                    <div key={category.name}>
                        <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-text-main'>{category.name}</span>
                        <span className='text-sm font-semibold text-text-main'>{category.amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${category.color} h-2 rounded-full transition-all duration-500 ease-out`}
                            style={{width:`${category.percentage}%`}}>

                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}