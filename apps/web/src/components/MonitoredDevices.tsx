import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { Activity, Trash2, ChevronDown, ChevronRight, BarChart3, Cloud } from 'lucide-react';
import { InterfaceTrafficModal } from './InterfaceTrafficModal';

export function MonitoredDevices() {
    const utils = trpc.useContext();
    const { data: monitoredDevices = [], isLoading } = trpc.snmp.getMonitoredDevices.useQuery();
    const [expandedDeviceIp, setExpandedDeviceIp] = useState<string | null>(null);
    const [selectedInterface, setSelectedInterface] = useState<{ device: any, index: number } | null>(null);

    const stopMutation = trpc.snmp.stopMonitoring.useMutation({
        onSuccess: () => {
            utils.snmp.getMonitoredDevices.invalidate();
        }
    });

    const handleStop = async (ip: string) => {
        if (confirm('Stop monitoring this device?')) {
            await stopMutation.mutateAsync({ ip });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400 flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <span>Loading monitored devices...</span>
                </div>
            </div>
        );
    }

    if (!monitoredDevices || monitoredDevices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Activity className="h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Devices Being Monitored</h3>
                <p className="text-slate-400 max-w-md">
                    Start monitoring devices by going to the "Devices" tab and clicking "Manage" on any discovered device.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="h-7 w-7 text-green-400" />
                        Live Monitoring
                    </h2>
                    <p className="text-slate-400 mt-1">
                        {monitoredDevices.length} device{monitoredDevices.length !== 1 ? 's' : ''} with active SNMP pooling
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {monitoredDevices.map((device: any) => (
                    <div key={device.ip} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300">
                        {/* Device Header Row */}
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-4" onClick={() => setExpandedDeviceIp(expandedDeviceIp === device.ip ? null : device.ip)}>
                                {expandedDeviceIp === device.ip ? <ChevronDown className="h-5 w-5 text-slate-500" /> : <ChevronRight className="h-5 w-5 text-slate-500" />}
                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                    <Cloud className={`h-5 w-5 ${device.status === 'up' ? 'text-blue-400' : 'text-red-400'}`} />
                                </div>
                                <div>
                                    <div className="font-bold text-white">{device.name}</div>
                                    <div className="text-xs font-mono text-slate-500">{device.ip}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:block text-right">
                                    <span className="text-xs text-slate-500 block uppercase tracking-wider mb-1">Interfaces</span>
                                    <span className="text-sm text-slate-300 font-medium">{device.interfaces.length} Activas</span>
                                </div>

                                <button
                                    onClick={() => handleStop(device.ip)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                                    title="Stop Monitoring"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Interfaces List (Expanded) */}
                        {expandedDeviceIp === device.ip && (
                            <div className="border-t border-slate-800 bg-slate-950/50 p-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {device.interfaces.map((ifIndex: number) => (
                                        <div
                                            key={ifIndex}
                                            onClick={() => setSelectedInterface({ device, index: ifIndex })}
                                            className="bg-slate-900 border border-slate-700/50 p-4 rounded-lg hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-blue-400" />
                                                    <span className="text-sm font-semibold text-white">Interface #{ifIndex}</span>
                                                </div>
                                                <BarChart3 className="h-4 w-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center justify-between">
                                                <span>Real-time traffic</span>
                                                <span className="text-blue-500 font-medium">View Charts →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedInterface && (
                <InterfaceTrafficModal
                    device={selectedInterface.device}
                    interfaceIndex={selectedInterface.index}
                    onClose={() => setSelectedInterface(null)}
                />
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                <p className="text-slate-500 text-sm">
                    Monitored data is collected via SNMP v2c and persisted in the local database.
                </p>
            </div>
        </div>
    );
}
