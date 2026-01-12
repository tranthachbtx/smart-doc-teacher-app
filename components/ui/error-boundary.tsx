"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 premium-neumo rounded-[3rem] border border-red-100 bg-red-50/10">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">ÄÃ£ xáº£y ra lá»—i há»‡ thá»‘ng</h2>
                    <p className="text-slate-500 text-sm text-center max-w-md mb-8 leading-relaxed">
                        Ráº¥t tiáº¿c, Ä‘Ã£ cÃ³ má»™t lá»—i khÃ´ng mong Ä‘á»£i xáº£y ra. Äá»«ng lo láº¯ng, dá»¯ liá»‡u cá»§a báº¡n trong Store Ä‘Ã£ Ä‘Æ°á»£c báº£o vá»‡.
                    </p>
                    <div className="bg-white/50 p-4 rounded-xl border border-red-50 text-[10px] font-mono text-red-500 mb-8 max-w-full overflow-auto">
                        {this.state.error?.message}
                    </div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="rounded-2xl bg-slate-900 text-white font-bold px-8"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Táº¢I Láº I TRANG
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
