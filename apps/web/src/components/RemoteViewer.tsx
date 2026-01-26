import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { X, Maximize2, Monitor } from 'lucide-react';
import { GuacamoleClient } from './GuacamoleClient';

interface RemoteViewerProps {
    agentId: string;
    mode: 'viewer' | 'administrator';
    serverUrl: string;
    connectionId?: string;
    onClose: () => void;
}

export function RemoteViewer({ agentId, mode, serverUrl, connectionId, onClose }: RemoteViewerProps) {
    const [frame, setFrame] = useState<string | null>(null);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // If connectionId is provided, we use Guacamole Client
    if (connectionId) {
        return (
            <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col">
                <div className="p-2 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                    <div className="flex items-center gap-3">
                        <Monitor className="text-blue-500 w-5 h-5" />
                        <h3 className="font-bold text-slate-100 italic">Remote Desktop: {agentId} (Guacamole)</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-rose-500/20 hover:text-rose-500 rounded-lg text-slate-400 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <GuacamoleClient connectionId={connectionId} serverUrl="http://192.168.0.121:8080/guacamole" />
                </div>
            </div>
        );
    }

    useEffect(() => {
        const socket = io(serverUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            setStatus('connecting'); // Waiting for agent
            socket.emit('join-session', { agentId });
        });

        socket.on('stream-frame', (base64Frame: string) => {
            setFrame(`data:image/jpeg;base64,${base64Frame}`);
            setStatus('connected');
        });

        socket.on('error', (err: { message: string }) => {
            setStatus('error');
            setErrorMsg(err.message);
        });

        return () => {
            socket.emit('leave-session', { agentId });
            socket.disconnect();
        };
    }, [agentId, serverUrl]);

    const handleInput = (type: string, data: any) => {
        if (mode !== 'administrator' || status !== 'connected') return;
        socketRef.current?.emit('user-input', { agentId, type, data });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        handleInput('mousemove', { x, y });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        handleInput('mousedown', { button: e.button });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        handleInput('keydown', { key: e.key, code: e.code });
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                    <div className="flex items-center gap-3">
                        <Monitor className="text-blue-500 w-5 h-5" />
                        <h3 className="font-bold text-slate-100 italic">Remote Desktop: {agentId} ({mode.toUpperCase()})</h3>
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

                <div
                    ref={containerRef}
                    className={`flex-1 bg-black relative flex items-center justify-center overflow-auto min-h-[400px] ${mode === 'administrator' ? 'cursor-crosshair' : 'cursor-default'}`}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                >
                    {frame ? (
                        <img
                            src={frame}
                            alt="Remote Desktop"
                            className="max-w-full max-h-full object-contain pointer-events-none"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-500 text-center p-8">
                            {status === 'error' ? (
                                <>
                                    <div className="text-rose-500 font-bold mb-2">Error</div>
                                    <p className="max-w-xs">{errorMsg || 'Failed to establish connection'}</p>
                                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm">Close</button>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                    <p className="animate-pulse">{status === 'connecting' ? 'Waiting for agent to start stream...' : 'Initializing...'}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
                    <span>Performance: {mode === 'administrator' ? 'Interactive Control' : 'Viewing Only'}</span>
                    <span className="capitalize">Status: {status}</span>
                </div>
            </div>
        </div>
    );
}
