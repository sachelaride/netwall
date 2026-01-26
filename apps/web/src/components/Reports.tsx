import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { trpc } from '../utils/trpc';

export function Reports() {
    const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateMutation = (trpc as any).reports.generateDeviceReport.useMutation();

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const result = await generateMutation.mutateAsync({ timeRange });
            const linkSource = `data:application/pdf;base64,${result.base64}`;
            const downloadLink = document.createElement("a");
            const fileName = `netwall_report_${new Date().toISOString().split('T')[0]}.pdf`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Network Reports</h2>
                        <p className="text-sm text-slate-400">Generate PDF extracts of your monitored infrastructure</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Report Time Range</label>
                            <div className="flex gap-2">
                                {(['1h', '24h', '7d'] as const).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeRange === range
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {range === '1h' ? 'Last Hour' : range === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Download PDF Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-lg p-6 border border-slate-800 flex flex-col justify-center">
                        <h3 className="text-sm font-bold text-slate-300 mb-2">What's included in the report?</h3>
                        <ul className="text-sm text-slate-400 space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                List of all active/monitored devices
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Detailed status and latency (ping) statistics
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                System uptime and recent history
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Basic traffic metrics for SNMP devices
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center">
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Advanced custom reports with charts and scheduled delivery are coming soon in Phase 2.
                </p>
            </div>
        </div>
    );
}
