"use client";

import React, { useEffect, useState } from 'react';
import {
    Activity,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    ShieldCheck,
    Zap,
    AlertTriangle,
    Key,
    Server,
    Cpu,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestResult {
    gemini: any[];
    openai: any;
    groq: any;
    proxy: any;
}

export default function ApiTestPage() {
    const [results, setResults] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const runTest = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/test-api-keys');
            if (!response.ok) throw new Error("KhÃ´ng thá»ƒ káº¿t ná»‘i vá»›i API Test.");
            const data = await response.json();
            setResults(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runTest();
    }, []);

    const StatusBadge = ({ ok, status }: { ok: boolean, status?: any }) => {
        if (ok) return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-3 py-1 gap-1"><CheckCircle2 className="w-3 h-3" /> HOáº T Äá»˜NG</Badge>;
        return <Badge variant="destructive" className="px-3 py-1 gap-1"><XCircle className="w-3 h-3" /> Lá»–I ({status})</Badge>;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header section with back button and title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <button
                            onClick={() => window.close()}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-bold mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" /> QUAY Láº I TRáº M ÄIá»€U KHIá»‚N
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldCheck className="w-10 h-10 text-indigo-600" />
                            Há»† THá»NG KIá»‚M Äá»ŠNH API KEY <span className="text-indigo-600">v36.0</span>
                        </h1>
                        <p className="text-slate-500 font-medium">BÃ¡o cÃ¡o tráº¡ng thÃ¡i sá»©c khá»e cá»§a cÃ¡c bá»™ nÃ£o AI trong há»‡ thá»‘ng Smart-Doc.</p>
                    </div>

                    <Button
                        onClick={runTest}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all gap-2 group"
                    >
                        {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />}
                        TÃI KIá»‚M TRA Há»† THá»NG
                    </Button>
                </div>

                {error && (
                    <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-[2rem] flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                        <AlertTriangle className="w-6 h-6 text-rose-500 mt-1" />
                        <div>
                            <h3 className="font-bold text-rose-900 leading-none mb-2 text-lg">Lá»—i Káº¿t Ná»‘i NghiÃªm Trá»ng</h3>
                            <p className="text-rose-700">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && results && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Gemini Pool Section - Takes 2 columns on large screens */}
                        <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white/70 backdrop-blur-xl">
                            <CardHeader className="bg-slate-900 text-white p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black uppercase tracking-tight">Gemini Strategy Pool</CardTitle>
                                            <CardDescription className="text-slate-400 font-bold">Há»‡ thá»‘ng xoay vÃ²ng Key thÃ´ng minh cá»§a Google</CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="bg-indigo-400/20 text-indigo-300 border-indigo-400/30 px-4 py-1">PRIMARY</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.gemini.map((item, idx) => (
                                        <div key={idx} className={`p-6 rounded-[2rem] border-2 transition-all ${item.ok ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl ${item.ok ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                                                        <Key className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-black text-slate-800 uppercase text-xs tracking-widest">Key #{item.key}</span>
                                                </div>
                                                <StatusBadge ok={item.ok} status={item.status} />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 font-bold">Máº«u mÃ¡y chá»§:</span>
                                                    <span className="text-slate-900 font-black font-mono">{item.model}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 font-bold">Tiá»n tá»‘ Key:</span>
                                                    <span className="bg-white px-2 py-0.5 rounded border text-xs font-mono text-slate-600">{item.keyPrefix}</span>
                                                </div>
                                                {item.error && (
                                                    <div className="mt-3 p-3 bg-white/80 rounded-xl border border-rose-200 text-[10px] text-rose-600 font-mono overflow-auto max-h-20 whitespace-normal">
                                                        {item.error}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar Sections */}
                        <div className="space-y-8">

                            {/* Proxy Status */}
                            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
                                <CardHeader className="p-6 pb-0">
                                    <div className="flex items-center gap-3">
                                        <Server className="w-5 h-5 text-indigo-600" />
                                        <CardTitle className="text-lg font-black uppercase text-slate-800">Cloudflare Proxy</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {(results.proxy) ? (
                                        <div className={`p-5 rounded-3xl border-2 ${results.proxy.ok ? 'bg-blue-50/50 border-blue-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tráº¡ng thÃ¡i</span>
                                                <StatusBadge ok={results.proxy.ok} status={results.proxy.status} />
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-mono mb-2 truncate">URL: {results.proxy.url}</p>
                                            {results.proxy.error && <p className="text-[10px] text-rose-500 font-mono">{results.proxy.error}</p>}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
                                            <Badge variant="outline" className="text-slate-300">CHÆ¯A Cáº¤U HÃŒNH</Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Backups Status */}
                            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-indigo-900 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Cpu className="w-20 h-20 text-white" />
                                </div>
                                <CardHeader className="p-6 pb-0 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-indigo-400" />
                                        <CardTitle className="text-lg font-black uppercase tracking-tight">AI Backups</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4 relative z-10">
                                    {/* OpenAI */}
                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                                        <span className="font-bold text-sm">OpenAI (GPT-4o)</span>
                                        {results.openai ? (
                                            <div className={`w-3 h-3 rounded-full ${results.openai.ok ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-rose-400'}`} />
                                        ) : (
                                            <span className="text-[10px] opacity-40">Offline</span>
                                        )}
                                    </div>
                                    {/* Groq */}
                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                                        <span className="font-bold text-sm">Groq (Llama 3)</span>
                                        {results.groq ? (
                                            <div className={`w-3 h-3 rounded-full ${results.groq.ok ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-rose-400'}`} />
                                        ) : (
                                            <span className="text-[10px] opacity-40">Offline</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                            <Activity className="w-10 h-10 text-indigo-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Äang quÃ©t toÃ n bá»™ há»‡ thá»‘ng...</h2>
                        <p className="text-slate-400 font-medium">Tiáº¿n trÃ¬nh nÃ y máº¥t khoáº£ng 5-10 giÃ¢y Ä‘á»ƒ xÃ¡c thá»±c táº¥t cáº£ nhÃ  cung cáº¥p AI.</p>
                    </div>
                )}

                <div className="text-center pb-12">
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">SmartDoc Teacher Engine - Monitoring System</p>
                </div>
            </div>
        </div>
    );
}
