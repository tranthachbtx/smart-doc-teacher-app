"use client"

import TemplateEngine from "@/components/template-engine"
import { Sparkles } from "lucide-react"
import { DEPT_INFO } from "@/lib/department"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-[5px_5px_15px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.9)]">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-balance">SmartDoc - {DEPT_INFO.name}</h1>
          <p className="text-gray-600 text-lg text-pretty">{DEPT_INFO.school}</p>
        </header>

        {/* Main Content */}
        <TemplateEngine />
      </div>
    </main>
  )
}
