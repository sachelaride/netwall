import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { X, Shield, Eye, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

interface RemoteAccessRequestModalProps {
    agentId: string;
    onGranted: (mode: 'viewer' | 'administrator', connectionId?: string) => void;
    onClose: () => void;
}

export function RemoteAccessRequestModal({ agentId, onGranted, onClose }: RemoteAccessRequestModalProps) {
    const [mode, setMode] = useState<'viewer' | 'administrator'>('viewer');
    const [status, setStatus] = useState<'idle' | 'pending' | 'granted' | 'rejected'>('idle');
    const [requestId, setRequestId] = useState<string | null>(null);

    const requestMutation = (trpc as any).remote.requestAccess.useMutation();
    const { data: requestStatus } = (trpc as any).remote.checkRequestStatus.useQuery(
        { requestId: requestId! },
        {
            enabled: !!requestId && status === 'pending',
            refetchInterval: 2000
        }
    );

    useEffect(() => {
        if (requestStatus?.status === 'granted') {
            setStatus('granted');
            // Pass the connectionId if available (for Guacamole)
            setTimeout(() => onGranted(mode, requestStatus.connectionId), 1000);
        } else if (requestStatus?.status === 'rejected') {
            setStatus('rejected');
        }
    }, [requestStatus, onGranted, mode]);

    const handleRequest = async () => {
        try {
            setStatus('pending');
            const res = await requestMutation.mutateAsync({ agentId, mode });
            setRequestId(res.requestId);
        } catch (e) {
            console.error(e);
            setStatus('idle');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-500 w-6 h-6" />
                        <h3 className="text-xl font-bold text-white">Acesso Remoto</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {status === 'idle' && (
                        <>
                            <p className="text-slate-400 text-sm">
                                Selecione o nível de privilégio necessário. O usuário do dispositivo precisará autorizar a conexão.
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setMode('viewer')}
                                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${mode === 'viewer' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${mode === 'viewer' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Visualizador</div>
                                        <div className="text-xs text-slate-500 mt-1">Apenas visualização do desktop. Sem entrada de mouse/teclado.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setMode('administrator')}
                                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${mode === 'administrator' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${mode === 'administrator' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Administrador</div>
                                        <div className="text-xs text-slate-500 mt-1">Controle total. Permite mover mouse e digitar remotamente.</div>
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={handleRequest}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Solicitar Permissão
                            </button>
                        </>
                    )}

                    {status === 'pending' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="relative inline-block">
                                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 w-6 h-6 animate-pulse" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Aguardando Autorização</h4>
                            <p className="text-slate-400 text-sm">
                                Uma solicitação foi enviada ao usuário em <strong>{agentId}</strong>.
                                Por favor, peça para clicarem em "Sim" no diálogo exibido.
                            </p>
                        </div>
                    )}

                    {status === 'granted' && (
                        <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                            <h4 className="text-lg font-bold text-white">Acesso Concedido!</h4>
                            <p className="text-slate-400 text-sm italic">Iniciando sessão remota...</p>
                        </div>
                    )}

                    {status === 'rejected' && (
                        <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h4 className="text-lg font-bold text-white">Acesso Negado</h4>
                            <p className="text-slate-400 text-sm">O usuário recusou o pedido de conexão.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="text-blue-500 hover:underline text-sm font-medium"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
