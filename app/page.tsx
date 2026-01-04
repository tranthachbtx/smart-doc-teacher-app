"use client";

import { TemplateEngine } from "@/components/template-engine/TemplateEngineV2";
import { Sparkles } from "lucide-react";
import { DEPT_INFO } from "@/lib/config/department";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <TemplateEngine />
      </div>
    </main>
  );
}
