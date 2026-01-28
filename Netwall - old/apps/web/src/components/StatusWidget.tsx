import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatusWidgetProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'red' | 'yellow';
}

export function StatusWidget({ title, value, trend, trendUp, icon: Icon, color = 'blue' }: StatusWidgetProps) {
    const colorStyles = {
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        red: 'bg-red-500/10 text-red-500',
        yellow: 'bg-yellow-500/10 text-yellow-500',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={twMerge("p-3 rounded-lg", colorStyles[color])}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={clsx("text-sm font-medium px-2 py-1 rounded",
                        trendUp ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                    )}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
            </div>
        </div>
    );
}
