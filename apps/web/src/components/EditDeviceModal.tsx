import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { X, Save } from 'lucide-react';

interface EditDeviceModalProps {
    device: any;
    onClose: () => void;
}

const DEVICE_TYPES = ['SERVER', 'ROUTER', 'SWITCH', 'PRINTER', 'WORKSTATION', 'OTHER'];

export function EditDeviceModal({ device, onClose }: EditDeviceModalProps) {
    const [name, setName] = useState(device.name || '');
    const [type, setType] = useState(device.type.toUpperCase());
    const [department, setDepartment] = useState(device.department || '');
    const [user, setUser] = useState(device.user || '');

    const utils = trpc.useContext();
    const updateMutation = trpc.scan.updateDevice.useMutation({
        onSuccess: () => {
            utils.scan.getDevices.invalidate();
            onClose();
        }
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({
                id: device.id,
                name,
                type,
                department,
                user
            });
        } catch (error) {
            console.error('Failed to update device:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Editar Dispositivo</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Nome do Dispositivo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">IP Address (Não Editável)</label>
                        <input
                            type="text"
                            value={device.ip}
                            disabled
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Equipamento</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {DEVICE_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Departamento</label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="TI / Vendas / etc"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Utilizador</label>
                            <input
                                type="text"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="Nome do Responsável"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {updateMutation.isLoading ? 'Salvando...' : <><Save className="h-4 w-4" /> Salvar Alterações</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
