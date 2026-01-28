import { useState } from 'react';
import { Search, Filter, Server, Laptop, Printer, Wifi, Shield, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { trpc } from '../utils/trpc';



const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'server': return <Server className="h-4 w-4" />;
        case 'workstation': return <Laptop className="h-4 w-4" />;
        case 'printer': return <Printer className="h-4 w-4" />;
        case 'switch': return <Wifi className="h-4 w-4" />;
        case 'firewall': return <Shield className="h-4 w-4" />;
        default: return <Server className="h-4 w-4" />;
    }
};

const StatusIndicator = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        online: 'bg-green-500',
        offline: 'bg-red-500',
        warning: 'bg-yellow-500',
    };

    return (
        <div
            className={`h-2 w-2 rounded-full ${colors[status] || colors.offline} shadow-[0_0_8px_rgba(34,197,94,0.4)]`}
            title={status.toUpperCase()}
        />
    );
};

import { ManageDeviceModal } from './ManageDeviceModal';
import { DeviceMetricsModal } from './DeviceMetricsModal';
import { EditDeviceModal } from './EditDeviceModal';

export function DeviceList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [deptFilter, setDeptFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [managingDevice, setManagingDevice] = useState<any>(null);
    const [metricsDevice, setMetricsDevice] = useState<any>(null);
    const [editingDevice, setEditingDevice] = useState<any>(null);

    // Multi-selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkDept, setBulkDept] = useState('');
    const [isBulkLoading, setIsBulkLoading] = useState(false);

    // TODO: Bulk Action Tasks
    // - [x] Device Management Enhancement
    // - [x] Update Prisma schema with `department` and `user`
    // - [x] Implement `updateDevice` mutation in backend
    // - [x] Add filtering logic to `getDevices` query
    // - [x] Implement Edit Modal and Filter UI in frontend
    // - [x] Add IP range filtering capability
    // - [x] Fix lint errors and verify build
    // - [x] Simplify Device List UI (Remove Status/Last Seen columns)
    // - [x] Add dedicated 'Utilizador' column in table
    // - [x] Enhance dashboard responsiveness for mobile devices
    // - [x] Rename 'Equipamento' header to 'Nome'
    // - [x] Implement backend-supported dynamic sorting for all columns
    // - [x] Implement multi-selection UI in DeviceList (Checkboxes)
    // - [x] Implement `bulkUpdateDevices` mutation for departments

    // Fetch devices from backend with filters and sorting
    const utils = trpc.useContext();
    const { data: devices = [], isLoading } = trpc.scan.getDevices.useQuery({
        search: searchTerm,
        type: typeFilter,
        department: deptFilter,
        sortBy,
        sortOrder
    });

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30"><ChevronUp className="h-4 w-4" /></div>;
        return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-400" /> : <ChevronDown className="h-4 w-4 text-blue-400" />;
    };

    const deleteMutation = trpc.scan.deleteDevice.useMutation({
        onSuccess: () => {
            utils.scan.getDevices.invalidate();
        }
    });

    const bulkUpdateMutation = trpc.scan.bulkUpdateDevices.useMutation({
        onSuccess: () => {
            utils.scan.getDevices.invalidate();
            setSelectedIds([]);
            setBulkDept('');
            setIsBulkLoading(false);
        }
    });

    const handleDelete = async (device: any) => {
        if (confirm(`Are you sure you want to delete ${device.name || device.ip}?`)) {
            await deleteMutation.mutateAsync({ id: device.id });
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(devices.map((d: any) => d.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDepartment = async () => {
        if (!bulkDept) return;
        setIsBulkLoading(true);
        await bulkUpdateMutation.mutateAsync({
            ids: selectedIds,
            department: bulkDept
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-400">Loading devices...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Network Assets</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Add Device
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Procurar por Nome, IP, Hostname, Utilizador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm w-full appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-white"
                        >
                            <option value="all">Todos os Tipos</option>
                            <option value="server">Server</option>
                            <option value="router">Router</option>
                            <option value="switch">Switch</option>
                            <option value="printer">Printer</option>
                            <option value="workstation">Workstation</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Filtrar Departamento..."
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-full text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
                        <span className="text-xs text-slate-500 uppercase font-bold">Total:</span>
                        <span className="text-sm text-blue-400 font-mono">{devices.length}</span>
                    </div>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-blue-400">
                            {selectedIds.length} dispositivos selecionados
                        </span>
                        <div className="h-6 w-px bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Novo Departamento..."
                                value={bulkDept}
                                onChange={(e) => setBulkDept(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleBulkDepartment}
                                disabled={!bulkDept || isBulkLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                                {isBulkLoading ? 'A aplicar...' : 'Definir para todos'}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedIds([])}
                        className="text-sm text-slate-400 hover:text-white"
                    >
                        Limpar Seleção
                    </button>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/80 text-slate-400 font-medium border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === devices.length && devices.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                    />
                                </th>
                                <th onClick={() => toggleSort('name')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">Nome <SortIcon field="name" /></div>
                                </th>
                                <th onClick={() => toggleSort('utilizador')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">Utilizador <SortIcon field="utilizador" /></div>
                                </th>
                                <th onClick={() => toggleSort('ip')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">IP Address <SortIcon field="ip" /></div>
                                </th>
                                <th onClick={() => toggleSort('tipo')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">Tipo / Modelo <SortIcon field="tipo" /></div>
                                </th>
                                <th onClick={() => toggleSort('departamento')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">Departamento <SortIcon field="departamento" /></div>
                                </th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {devices.map((device: any) => (
                                <tr
                                    key={device.id}
                                    className={`
                                        hover:bg-slate-800/30 transition-colors group border-b border-slate-800
                                        ${selectedIds.includes(device.id) ? 'bg-blue-500/5' : ''}
                                    `}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(device.id)}
                                            onChange={() => toggleSelect(device.id)}
                                            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white min-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            <StatusIndicator status="online" />
                                            <div className="flex flex-col">
                                                <span>{device.name || device.ip}</span>
                                                {device.hostname && device.hostname !== (device.name || '').toLowerCase() && (
                                                    <span className="text-xs text-slate-500 font-normal">{device.hostname}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {device.user ? (
                                            <span className="text-sm text-blue-400 font-medium">@{device.user}</span>
                                        ) : (
                                            <span className="text-xs text-slate-500 italic">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-300">{device.ip}</td>
                                    <td className="px-6 py-4 min-w-[150px]">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <TypeIcon type={device.type} />
                                            <div className="flex flex-col">
                                                <span className="capitalize">{device.type}</span>
                                                {device.model && (
                                                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]" title={device.model}>
                                                        {device.model}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 italic min-w-[120px]">
                                        {device.department || 'Não Definido'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setEditingDevice(device)}
                                                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setManagingDevice(device)}
                                                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded text-xs font-medium transition-colors"
                                            >
                                                Manage
                                            </button>
                                            <button
                                                onClick={() => setMetricsDevice(device)}
                                                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-3 py-1 rounded text-xs font-medium transition-colors"
                                            >
                                                Metrics
                                            </button>
                                            <button
                                                onClick={() => handleDelete(device)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete Device"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {devices.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-white">
                        Nenhum dispositivo encontrado com estes filtros.
                    </div>
                )}
            </div>
            {editingDevice && (
                <EditDeviceModal
                    device={editingDevice}
                    onClose={() => setEditingDevice(null)}
                />
            )}
            {managingDevice && (
                <ManageDeviceModal
                    device={managingDevice}
                    onClose={() => setManagingDevice(null)}
                />
            )}
            {metricsDevice && (
                <DeviceMetricsModal
                    device={metricsDevice}
                    onClose={() => setMetricsDevice(null)}
                />
            )}
        </div >
    );
}
