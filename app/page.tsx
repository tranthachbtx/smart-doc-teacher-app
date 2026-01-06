"use client";

import { TemplateEngine } from "@/components/template-engine/TemplateEngineV2";
import { DEPT_INFO } from "@/lib/config/department";

export default function Home() {
  return (
    <main className="min-h-screen">
      <TemplateEngine />
    </main>
  );
}
