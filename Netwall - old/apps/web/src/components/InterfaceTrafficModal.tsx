import { useState } from 'react';
import { X, Activity } from 'lucide-react';
import { trpc } from '../utils/trpc';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InterfaceTrafficModalProps {
    device: {
        ip: string;
        name?: string;
    };
    interfaceIndex: number;
    onClose: () => void;
}

export function InterfaceTrafficModal({ device, interfaceIndex, onClose }: InterfaceTrafficModalProps) {
    const [timeRange, setTimeRange] = useState<'1m' | '1h' | '24h' | '7d'>('1h');

    const { data: metrics = [], isLoading } = trpc.metrics.getInterfaceMetrics.useQuery({
        deviceIp: device.ip,
        interfaceIndex,
        timeRange
    }, {
        refetchInterval: timeRange === '1m' ? 5000 : 30000 // Refresh more often for 1m view
    });

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-400 text-xs mb-2">
                        {new Date(label).toLocaleString()}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-300 text-sm capitalize">{entry.name}:</span>
                            <span className="text-white text-sm font-mono font-bold">
                                {formatBytes(entry.value)}/s
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {device.name || device.ip} - Interface #{interfaceIndex}
                            </h3>
                            <p className="text-sm text-slate-400">Traffic Throughput Analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Controls */}
                <div className="px-6 py-4 bg-slate-800/30 flex justify-between items-center border-b border-slate-800">
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {[
                            { id: '1m', label: '1m' },
                            { id: '1h', label: '1h' },
                            { id: '24h', label: '1d' },
                            { id: '7d', label: '7d' },
                        ].map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setTimeRange(range.id as any)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeRange === range.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <div className="text-slate-400 flex flex-col items-center gap-3">
                                <div className="h-8 w-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                <span>Loading metrics...</span>
                            </div>
                        </div>
                    ) : metrics.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-slate-500 gap-4">
                            <Activity className="h-12 w-12 opacity-20" />
                            <div className="text-center">
                                <p className="text-lg font-medium text-slate-400">No data available for this range</p>
                                <p className="text-sm">Wait a few seconds for the next polling cycle (10s interval)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metrics}>
                                    <defs>
                                        <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(time) => {
                                            const date = new Date(time);
                                            return timeRange === '1m' || timeRange === '1h'
                                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                                : date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' });
                                        }}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={formatBytes}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        name="Incoming"
                                        type="monotone"
                                        dataKey="bytesIn"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorIn)"
                                        animationDuration={1000}
                                    />
                                    <Area
                                        name="Outgoing"
                                        type="monotone"
                                        dataKey="bytesOut"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorOut)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
