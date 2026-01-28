import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { X, Maximize2, Monitor } from 'lucide-react';

interface RemoteViewerProps {
    agentId: string;
    serverUrl: string;
    onClose: () => void;
}

export function RemoteViewer({ agentId, serverUrl, onClose }: RemoteViewerProps) {
    const [frame, setFrame] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(serverUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[Viewer] Connected to server');
            socket.emit('join-session', { agentId });
        });

        socket.on('stream-frame', (base64Frame: string) => {
            setFrame(`data:image/jpeg;base64,${base64Frame}`);
        });

        return () => {
            socket.emit('leave-session', { agentId });
            socket.disconnect();
        };
    }, [agentId, serverUrl]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                    <div className="flex items-center gap-3">
                        <Monitor className="text-blue-500 w-5 h-5" />
                        <h3 className="font-bold text-slate-100 italic">Remote Desktop: {agentId}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                            <Maximize2 size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-rose-500/20 hover:text-rose-500 rounded-lg text-slate-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-black relative flex items-center justify-center overflow-auto min-h-[400px]">
                    {frame ? (
                        <img
                            src={frame}
                            alt="Remote Desktop"
                            className="max-w-full max-h-full object-contain pointer-events-none"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-500">
                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="animate-pulse">Waiting for desktop stream...</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
                    <span>Performance: Viewing Only (Interactive support coming soon)</span>
                    <span>Socket Status: Connected</span>
                </div>
            </div>
        </div>
    );
}
