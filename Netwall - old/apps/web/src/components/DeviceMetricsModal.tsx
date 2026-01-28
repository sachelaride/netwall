import { trpc } from '../utils/trpc';
import { X, Loader2, Cpu, MemoryStick as Memory, Activity } from 'lucide-react';
import { MetricChart } from './MetricChart';
import { useState } from 'react';

interface DeviceMetricsModalProps {
    device: {
        id: string;
        ip: string;
        hostname: string;
        name?: string;
    };
    onClose: () => void;
}

export function DeviceMetricsModal({ device, onClose }: DeviceMetricsModalProps) {
    const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');

    const { data: metrics, isLoading, error } = trpc.metrics.getSystemMetrics.useQuery({
        deviceId: device.id,
        timeRange
    });

    interface MetricData {
        timestamp: string;
        cpu: number;
        memory: number;
    }

    // Prepare data for Recharts
    const cpuData = (metrics as MetricData[] | undefined)?.map((m: MetricData) => ({
        time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: m.cpu
    })) || [];

    const memData = (metrics as MetricData[] | undefined)?.map((m: MetricData) => ({
        time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: m.memory
    })) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{device.name || device.hostname || device.ip}</h3>
                            <p className="text-sm text-slate-400">System Performance Metrics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="1h">Last 1 Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                        </select>
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                            <p className="text-slate-400">Fetching metrics from InfluxDB...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-900/20 border border-red-800/50 p-6 rounded-xl text-center">
                            <p className="text-red-400 font-medium">Failed to load metrics</p>
                            <p className="text-red-500/70 text-sm mt-1">{error.message}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* CPU Chart */}
                            <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <Cpu className="h-5 w-5 text-purple-400" />
                                    <h4 className="font-semibold text-white">CPU Load</h4>
                                </div>
                                <div className="h-[250px]">
                                    <MetricChart
                                        data={cpuData}
                                        color="#a855f7"
                                        unit="%"
                                    />
                                </div>
                            </div>

                            {/* Memory Chart */}
                            <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <Memory className="h-5 w-5 text-emerald-400" />
                                    <h4 className="font-semibold text-white">Memory Usage</h4>
                                </div>
                                <div className="h-[250px]">
                                    <MetricChart
                                        data={memData}
                                        color="#10b981"
                                        unit="%"
                                    />
                                </div>
                            </div>

                            {metrics?.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                                    <p className="text-slate-500">No data found for the selected period.</p>
                                    <p className="text-xs text-slate-600 mt-1">Ensure the Netwall Agent is running on the target device.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-500">
                        Device IP: <span className="font-mono">{device.ip}</span> • UUID: <span className="font-mono">{device.id}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
