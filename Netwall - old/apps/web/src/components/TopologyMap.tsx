import { useState, useRef, useMemo } from 'react';
import { Server, Shield, Globe, Wifi, Laptop, ZoomIn, ZoomOut, Move, Monitor } from 'lucide-react';
import { trpc } from '../utils/trpc';
import { RemoteViewer } from './RemoteViewer';

interface Node {
    id: string;
    type: 'router' | 'firewall' | 'server' | 'switch' | 'endpoint';
    label: string;
    x: number;
    y: number;
    status: 'ok' | 'warning' | 'error';
    latency?: number;
    ip?: string;
    parentId?: string | null;
}

interface Link {
    source: string;
    target: string;
}

const NodeIcon = ({ type, className }: { type: string, className?: string }) => {
    switch (type) {
        case 'router': return <Globe className={className} />;
        case 'firewall': return <Shield className={className} />;
        case 'switch': return <Wifi className={className} />;
        case 'server': return <Server className={className} />;
        case 'endpoint': return <Laptop className={className} />;
        default: return <Server className={className} />;
    }
};

const getNodeColor = (status: string) => {
    switch (status) {
        case 'ok': return '#10b981'; // emerald-500
        case 'warning': return '#f59e0b'; // amber-500
        case 'error': return '#ef4444'; // red-500
        default: return '#64748b'; // slate-500
    }
};

export function TopologyMap() {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [showOnlySwitches, setShowOnlySwitches] = useState(false);
    const [remoteAgentId, setRemoteAgentId] = useState<string | null>(null);

    // Fetch real devices
    const { data: devices = [] } = trpc.scan.getDevices.useQuery();

    // Transform scanned devices into topology nodes
    const { nodes: realNodes, links: realLinks } = useMemo(() => {
        const nodes: Node[] = [
            // Static infrastructure
            { id: 'WAN', type: 'router', label: 'Internet', x: 400, y: 50, status: 'ok', ip: '0.0.0.0' },
            { id: 'FW1', type: 'firewall', label: 'Gateway', x: 400, y: 150, status: 'ok', ip: '192.168.1.1' },
            { id: 'SW_CORE', type: 'switch', label: 'Core Switch', x: 400, y: 250, status: 'ok', ip: '192.168.1.2' },
        ];

        const links: Link[] = [
            { source: 'WAN', target: 'FW1' },
            { source: 'FW1', target: 'SW_CORE' },
        ];

        // Filter devices if requested
        const filteredDevices = showOnlySwitches ? devices.filter(d => d.type === 'switch') : devices;

        // Dynamic nodes from scan
        filteredDevices.forEach((device: any, index: number) => {
            const isSwitch = device.type === 'switch';

            // Simple layout calculation - Switches in a row, sub-devices below
            let x, y;
            if (isSwitch) {
                x = 100 + (index * 150);
                y = 350;
            } else {
                const rowSize = 5;
                const row = Math.floor(index / rowSize);
                const col = index % rowSize;
                x = 150 + (col * 140);
                y = 500 + (row * 120);
            }

            nodes.push({
                id: device.id,
                type: device.type as any,
                label: device.name || device.ip,
                ip: device.ip,
                x: x,
                y: y,
                status: device.status === 'online' ? 'ok' : 'error',
                latency: device.lastLatency,
                parentId: device.parentId
            });

            // If it has a parent in the node list, link to it
            // Otherwise link to SW_CORE as default fallback
            const parentId = device.parentId || 'SW_CORE';
            links.push({ source: parentId, target: device.id });
        });

        return { nodes, links };
    }, [devices, showOnlySwitches]);

    // Fallback to mock if empty (just for visual before scan)
    const activeNodes = realNodes.length > 3 ? realNodes : realNodes; // Keep logic simple
    const activeLinks = realLinks;

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleReset = () => {
        setPan({ x: 0, y: 0 });
        setZoom(1);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Network Topology</h2>
                <div className="flex gap-2">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 bg-slate-800 rounded hover:bg-slate-700">
                        <ZoomOut className="h-5 w-5" />
                    </button>
                    <button onClick={handleReset} className="p-2 bg-slate-800 rounded hover:bg-slate-700">
                        <Move className="h-5 w-5" />
                    </button>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-slate-800 rounded hover:bg-slate-700">
                        <ZoomIn className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setShowOnlySwitches(!showOnlySwitches)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${showOnlySwitches ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {showOnlySwitches ? 'Showing Switches' : 'Showing All'}
                    </button>
                </div>
            </div>

            <div
                className="h-[600px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="absolute inset-0 transition-transform duration-75 ease-linear origin-center"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                    }}
                >
                    <svg width="100%" height="100%" className="overflow-visible">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                            </marker>
                        </defs>
                        {/* Links */}
                        {activeLinks.map((link, i) => {
                            const source = activeNodes.find(n => n.id === link.source)!;
                            const target = activeNodes.find(n => n.id === link.target)!;
                            if (!source || !target) return null;
                            return (
                                <line
                                    key={i}
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke="#334155"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        })}

                        {/* Nodes */}
                        {activeNodes.map((node) => (
                            <g
                                key={node.id}
                                transform={`translate(${node.x},${node.y})`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNode(node.id);
                                }}
                                className="cursor-pointer group"
                            >
                                <circle
                                    r="24"
                                    fill={selectedNode === node.id ? '#1e293b' : '#0f172a'}
                                    stroke={getNodeColor(node.status)}
                                    strokeWidth={selectedNode === node.id ? 3 : 2}
                                    className="transition-colors duration-200"
                                />
                                <foreignObject x="-12" y="-12" width="24" height="24" className="pointer-events-none">
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <NodeIcon type={node.type} className="h-4 w-4" />
                                    </div>
                                </foreignObject>
                                <text
                                    y="38"
                                    textAnchor="middle"
                                    className="text-[10px] fill-slate-200 font-bold select-none group-hover:fill-white transition-colors"
                                >
                                    {node.label}
                                </text>
                                <text
                                    y="48"
                                    textAnchor="middle"
                                    className="text-[9px] fill-slate-400 select-none"
                                >
                                    {node.ip}
                                </text>
                                <text
                                    y="58"
                                    textAnchor="middle"
                                    className={`text-[8px] font-mono select-none ${node.status === 'ok' ? 'fill-emerald-400' : 'fill-rose-400'}`}
                                >
                                    {node.status === 'ok' ? 'ACTIVE' : 'OFFLINE'}
                                </text>
                                {node.latency != null && (
                                    <text
                                        y="68"
                                        textAnchor="middle"
                                        className="text-[8px] fill-slate-500 select-none"
                                    >
                                        {node.latency.toFixed(1)} ms
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Info Panel Overlay */}
                {selectedNode && (
                    <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-lg w-64 shadow-xl">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white">Details</h3>
                            <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">×</button>
                        </div>
                        {(() => {
                            const node = activeNodes.find(n => n.id === selectedNode)!;
                            const isStatic = ['WAN', 'FW1', 'SW_CORE'].includes(node.id);
                            const switches = activeNodes.filter(n => n.type === 'switch' && n.id !== node.id);

                            const setParent = (trpc.scan as any).setParentDevice.useMutation({
                                onSuccess: () => {
                                    (utils.scan as any).getDevices.invalidate();
                                }
                            });

                            const utils = trpc.useContext();

                            return (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Name:</span>
                                        <span className="text-slate-200">{node.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">IP:</span>
                                        <span className="text-slate-200">{node.ip}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Status:</span>
                                        <span className="text-slate-200 capitalize" style={{ color: getNodeColor(node.status) }}>
                                            {node.status === 'ok' ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                    {node.latency != null && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Latency:</span>
                                            <span className="text-slate-200">{node.latency.toFixed(2)} ms</span>
                                        </div>
                                    )}

                                    {!isStatic && (
                                        <div className="pt-2 mt-2 border-t border-slate-700">
                                            <label className="block text-xs text-slate-400 mb-1">Connected To (Parent):</label>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                                                value={node.parentId || 'SW_CORE'}
                                                onChange={(e) => {
                                                    setParent.mutate({ deviceId: node.id, parentId: e.target.value === 'null' ? null : e.target.value });
                                                }}
                                            >
                                                <option value="SW_CORE">Core Switch</option>
                                                {switches.map(sw => (
                                                    <option key={sw.id} value={sw.id}>{sw.label} ({sw.ip})</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="pt-2 mt-2 border-t border-slate-700 space-y-2">
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs">
                                            Manage Device
                                        </button>
                                        {(node as any).agentId && (
                                            <button
                                                onClick={() => setRemoteAgentId((node as any).agentId)}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded text-xs flex items-center justify-center gap-2"
                                            >
                                                <Monitor className="w-3 h-3" />
                                                Remote Desktop
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>

            <p className="text-sm text-slate-500 text-center">
                Interactive Map: Drag to pan, use buttons to zoom. Click nodes for details.
            </p>

            {remoteAgentId && (
                <RemoteViewer
                    agentId={remoteAgentId}
                    serverUrl="http://localhost:3001"
                    onClose={() => setRemoteAgentId(null)}
                />
            )}
        </div>
    );
}
