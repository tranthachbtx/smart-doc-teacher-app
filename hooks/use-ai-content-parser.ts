/**
 * 🧠 AI Content Parser Hook
 * Hook để phân tích nội dung từ Gemini Pro
 */

import { useState } from "react";

interface ParsedContent {
  title?: string;
  grade?: string;
  subject?: string;
  duration?: string;
  objectives?: string[];
  preparation?: string[];
  activities?: Array<{
    name: string;
    content: string;
    duration?: string;
  }>;
  assessment?: string[];
  homework?: string;
  notes?: string;
}

interface ParseResult {
  success: boolean;
  data?: ParsedContent;
  error?: string;
}

export function useAIContentParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResult | null>(null);

  const parseContent = async (content: string, context = "lesson_plan"): Promise<ParseResult> => {
    setIsParsing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini-tunnel/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi phân tích nội dung");
      }

      const parseResult: ParseResult = {
        success: data.success,
        data: data.data,
        error: data.error,
      };

      setResult(parseResult);
      return parseResult;

    } catch (err: any) {
      const errorMessage = err.message || "Đã xảy ra lỗi khi phân tích";
      setError(errorMessage);
      setResult({ success: false, error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setIsParsing(false);
    }
  };

  const reset = () => {
    setIsParsing(false);
    setError(null);
    setResult(null);
  };

  return {
    isParsing,
    error,
    result,
    parseContent,
    reset,
  };
}
