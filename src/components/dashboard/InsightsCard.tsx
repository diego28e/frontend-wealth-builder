import {Sparkles, TrendingUp,AlertCircle} from 'lucide-react';

export default function InsightsCard() {

    const insights = [
        {icon:TrendingUp,
         text: 'Your spending is 15% lower than last month',
         type: 'positive' as const,
        },
        {
            icon: AlertCircle,
            text: 'Food expenses are above your budget',
            type: 'warning' as const,
        },
        {
            icon: Sparkles,
            text: 'Great job! You saved $500 this month',
            type: 'positive' as const,
        }
    ]
    return(
        <div className='bg-surface-light rounded-xl border border-border-color p-6 '>
            <div className='flex items-center gap-2 mb-6'>
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Sparkles size={20} className='text-primary'/>
                </div>
                <div>
                    <h3 className='text-xl font-semibold text-text-main'>Ai Insights</h3>
                    <p className='text-sm text-text-secondary'>Personalized recommendations</p>
                </div>
            </div>

            <div className="space-y-4">
                {insights.map((insight, index)=>{
                    const Icon = insight.icon;
                    return (
                        <div key={index} className={`flex items-start gap-3 p-4 rounded-lg ${insight.type === 'positive' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <Icon size={20} className={`${insight.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}/>
                            <p className={`text-sm text-text-main flex-1 ${insight.type === 'positive' ? 'text-green-800' : 'text-red-800'}`}>
                                {insight.text}
                            </p>
 
                        </div>
                    )
                })}
            </div>
        </div>
    )
}