import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { Play, Loader2, Monitor } from 'lucide-react';

export function NetworkScan() {
    const [subnet, setSubnet] = useState('192.168.1.0/24');
    const utils = trpc.useUtils();

    const scanMutation = trpc.scan.quickScan.useMutation({
        onSuccess: () => {
            // Update device list after scan finds new devices
            utils.scan.getDevices.invalidate();
        }
    });

    const handleScan = () => {
        scanMutation.mutate({ subnet });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Network Scan</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={subnet}
                        onChange={(e) => setSubnet(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                        placeholder="CIDR (e.g. 192.168.1.0/24)"
                    />
                    <button
                        onClick={handleScan}
                        disabled={scanMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                    >
                        {scanMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Play className="h-5 w-5" />}
                        Start Scan
                    </button>
                </div>
            </div>

            {scanMutation.error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded">
                    Error: {scanMutation.error.message}
                </div>
            )}

            {scanMutation.data && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                        <h3 className="font-semibold">Scan Results ({scanMutation.data.devices.length} devices found)</h3>
                        <p className="text-sm text-slate-400">Target: {scanMutation.data.target}</p>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {scanMutation.data.devices.map((device: any, idx: number) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400">
                                        <Monitor className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{device.ip}</div>
                                        <div className="text-sm text-slate-400">{device.hostname || 'No hostname'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-300">MAC: {device.mac || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">{device.vendor || 'Unknown Vendor'}</div>
                                </div>
                            </div>
                        ))}
                        {scanMutation.data.devices.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No active devices found in this range.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
