import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { X, CheckCircle, AlertCircle, Play, Loader2 } from 'lucide-react';

interface ManageDeviceModalProps {
    device: any;
    onClose: () => void;
}

export function ManageDeviceModal({ device, onClose }: ManageDeviceModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [community, setCommunity] = useState('unigran');
    const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [snmpData, setSnmpData] = useState<any>(null);
    const [selectedInterfaces, setSelectedInterfaces] = useState<number[]>([]);

    const testConnection = trpc.snmp.testConnection.useMutation();
    const startMonitoring = trpc.snmp.startMonitoring.useMutation();

    const handleTest = async () => {
        setConnectionStatus('testing');
        setPingStatus('testing');
        try {
            const result = await testConnection.mutateAsync({
                ip: device.ip,
                community
            });

            if (result.success) {
                setPingStatus('success');
                setConnectionStatus('success');
                setSnmpData(result.data);

                const upIfaces = result.data.interfaces
                    .filter((i: any) => i.operStatus === 1)
                    .map((i: any) => i.index);
                setSelectedInterfaces(upIfaces);
                setTimeout(() => setStep(2), 800);
            } else {
                if (result.ping) {
                    setPingStatus('success'); // Ping OK
                    setConnectionStatus('error'); // SNMP Failed
                } else {
                    setPingStatus('error'); // Ping Failed
                    setConnectionStatus('idle'); // Didn't reach SNMP
                }
            }
        } catch (e) {
            setPingStatus('error');
            setConnectionStatus('error');
        }
    };

    const handleSave = async () => {
        try {
            await startMonitoring.mutateAsync({
                ip: device.ip,
                community,
                interfaces: selectedInterfaces
            });
            alert(`Monitoring started for ${device.ip}`);
            onClose();
        } catch (e) {
            alert('Failed to start monitoring');
        }
    };

    const toggleInterface = (index: number) => {
        if (selectedInterfaces.includes(index)) {
            setSelectedInterfaces(prev => prev.filter(i => i !== index));
        } else {
            setSelectedInterfaces(prev => [...prev, index]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">Manage Device</h2>
                        <p className="text-slate-400 text-sm">Configure monitoring for {device.ip}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-blue-200 text-sm">
                                Verify SNMP connectivity to assume control of this device.
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">SNMP Community String</label>
                                <input
                                    type="text"
                                    value={community}
                                    onChange={(e) => setCommunity(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="public"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleTest}
                                    disabled={connectionStatus === 'testing'}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                                >
                                    {connectionStatus === 'testing' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                                    Test Connection
                                </button>



                                <div className="flex flex-col gap-1 text-sm">
                                    {pingStatus !== 'idle' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500 w-12">Ping:</span>
                                            {pingStatus === 'testing' && <span className="text-blue-400 animate-pulse">Checking...</span>}
                                            {pingStatus === 'success' && <span className="text-green-400 font-medium">OK</span>}
                                            {pingStatus === 'error' && <span className="text-red-400 font-bold">Unreachable</span>}
                                        </div>
                                    )}
                                    {connectionStatus !== 'idle' && pingStatus === 'success' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500 w-12">SNMP:</span>
                                            {connectionStatus === 'testing' && <span className="text-blue-400 animate-pulse">Checking...</span>}
                                            {connectionStatus === 'success' && <span className="text-green-400 font-medium">Connected</span>}
                                            {connectionStatus === 'error' && <span className="text-red-400 font-bold">Failed</span>}
                                        </div>
                                    )}
                                </div>

                                {connectionStatus === 'error' && (
                                    <span className="flex items-center gap-2 text-red-400 font-medium animate-in fade-in slide-in-from-left-2">
                                        <AlertCircle className="h-5 w-5" /> Connection Failed
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && snmpData && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Select Interfaces to Monitor</h3>
                                <div className="text-sm text-slate-400">
                                    {selectedInterfaces.length} selected
                                </div>
                            </div>

                            <div className="border border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="bg-slate-800 text-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 w-10"></th>
                                            <th className="px-4 py-3">Index</th>
                                            <th className="px-4 py-3">Name/Desc</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                                        {snmpData.interfaces.map((iface: any) => (
                                            <tr
                                                key={iface.index}
                                                className={`hover:bg-slate-800/50 cursor-pointer ${selectedInterfaces.includes(iface.index) ? 'bg-blue-500/5' : ''}`}
                                                onClick={() => toggleInterface(iface.index)}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedInterfaces.includes(iface.index) ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                                                        {selectedInterfaces.includes(iface.index) && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">{iface.index}</td>
                                                <td className="px-4 py-3 text-white font-medium">{iface.description}</td>
                                                <td className="px-4 py-3">
                                                    {iface.operStatus === 1
                                                        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">UP</span>
                                                        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400">DOWN</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-slate-900/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                        Cancel
                    </button>
                    {step === 2 && (
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Play className="h-4 w-4" /> Start Monitoring
                        </button>
                    )}
                </div>
            </div>
        </div>

    );
}
