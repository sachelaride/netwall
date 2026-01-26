import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { StatusWidget } from './StatusWidget';
import { MetricChart } from './MetricChart';
import {
    Cpu,
    HardDrive,
    Wifi,
    Database,
    Activity,
    Plus,
    X,
    Server as ServerIcon,
    AlertCircle
} from 'lucide-react';

export function Dashboard() {
    const [realTimeData, setRealTimeData] = useState<any[]>([]);
    const [selectedCharts, setSelectedCharts] = useState<any[]>([]); // { id, name, type }

    // Fetch Stats
    const { data: serverStats } = trpc.dashboard.getServerStats.useQuery(undefined, {
        refetchInterval: 3000
    });
    const { data: dbStats } = trpc.dashboard.getDatabaseStats.useQuery(undefined, {
        refetchInterval: 10000
    });
    const { data: globalStats } = trpc.dashboard.getGlobalStats.useQuery(undefined, {
        refetchInterval: 10000
    });
    const { data: devices = [] } = trpc.scan.getDevices.useQuery();

    // Handle real-time network chart data
    useEffect(() => {
        if (serverStats) {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            setRealTimeData(prev => {
                const newData = [...prev, {
                    time: timeStr,
                    value: Math.round((serverStats.network.rx_sec + serverStats.network.tx_sec) / 1024 / 1024) // MB/s
                }];
                return newData.slice(-30); // Keep last 30 points
            });
        }
    }, [serverStats]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Netwall Dashboard</h2>
                <p className="text-slate-400">Monitoramento centralizado e performance do sistema</p>
            </div>

            {/* Server & DB Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusWidget
                    title="Servidor CPU"
                    value={`${serverStats?.cpu.load.toFixed(1) || 0}%`}
                    trend={`${globalStats?.online || 0} online`}
                    trendUp={true}
                    icon={Cpu}
                    color="blue"
                />
                <StatusWidget
                    title="Servidor RAM"
                    value={formatBytes(serverStats?.memory.used || 0)}
                    trend={`${serverStats?.memory.percent.toFixed(1) || 0}%`}
                    trendUp={false}
                    icon={HardDrive}
                    color="yellow"
                />
                <StatusWidget
                    title="Rede (In+Out)"
                    value={`${((serverStats?.network.rx_sec || 0 + (serverStats?.network.tx_sec || 0)) / 1024 / 1024).toFixed(2)} MB/s`}
                    icon={Wifi}
                    color="green"
                />
                <StatusWidget
                    title="Base de Dados"
                    value={formatBytes(dbStats?.postgres.sizeBytes || 0)}
                    trend={`${dbStats?.postgres.connections || 0} conns`}
                    trendUp={true}
                    icon={Database}
                    color="red"
                />
            </div>

            {/* Device Counts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            Tráfego de Rede do Servidor
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-slate-400">RX: {formatBytes(serverStats?.network.rx_sec || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-slate-400">TX: {formatBytes(serverStats?.network.tx_sec || 0)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <MetricChart
                            data={realTimeData}
                            color="#10b981"
                            unit=" MB/s"
                        />
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white">Estado da Rede</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <ServerIcon className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Monitorados</p>
                                    <p className="text-xs text-slate-500">Status Ativo</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-white">{globalStats?.total || 0}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Plus className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Descobertos</p>
                                    <p className="text-xs text-slate-500">Pendente Ativação</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-white">{globalStats?.discovered || 0}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/10 rounded-lg border border-red-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Offline</p>
                                    <p className="text-xs text-slate-500">Necessita Atenção</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-red-500">{globalStats?.offline || 0}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Status InfluxDB:</span>
                            <span className="text-green-500 font-medium">{dbStats?.influx.status === 'online' ? '● Saudável' : '○ Erro'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Metrics Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Dispositivos em Tempo Real
                    </h2>
                    {selectedCharts.length < 5 && (
                        <div className="flex gap-2">
                            <select
                                className="bg-slate-800 border border-slate-700 rounded text-xs px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    const [id, name] = e.target.value.split(':');
                                    if (selectedCharts.find(c => c.id === id)) return;
                                    setSelectedCharts([...selectedCharts, { id, name, type: 'cpu' }]);
                                }}
                                value=""
                            >
                                <option value="">+ Acompanhar Dispositivo</option>
                                {devices.filter(d => d.status === 'online').map(d => (
                                    <option key={d.id} value={`${d.id}:${d.name || d.ip}`}>{d.name || d.ip}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {selectedCharts.length === 0 ? (
                    <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-xl p-12 text-center">
                        <p className="text-slate-500 mb-4">Escolha até 5 dispositivos na lista acima para acompanhar o uso de recursos em tempo real</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedCharts.map((chart) => (
                            <div key={`${chart.id}-${chart.type}`} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 relative group">
                                <button
                                    onClick={() => setSelectedCharts(selectedCharts.filter(c => c.id !== chart.id))}
                                    className="absolute top-2 right-2 p-1 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-500 transition-colors z-10"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium text-white truncate max-w-[150px]">{chart.name}</h4>
                                    <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                        CPU & RAM
                                    </span>
                                </div>
                                <div className="h-[150px]">
                                    <DeviceLiveChart deviceId={chart.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DeviceLiveChart({ deviceId }: { deviceId: string }) {
    const [history, setHistory] = useState<any[]>([]);
    const { data: metrics } = trpc.metrics.getSystemMetrics.useQuery(
        { deviceId, timeRange: '1h' },
        { refetchInterval: 5000 }
    );

    useEffect(() => {
        if (metrics && metrics.length > 0) {
            const last = metrics[metrics.length - 1];
            const time = new Date(last.timestamp);
            const timeStr = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;

            setHistory(prev => {
                const newData = [...prev, { time: timeStr, value: last.cpu }];
                return newData.slice(-20);
            });
        }
    }, [metrics]);

    return (
        <MetricChart
            data={history}
            color="#3b82f6"
            unit="%"
        />
    );
}
