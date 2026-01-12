/**
 * ðŸŽ“ LESSON ENGINE COMPONENT
 * Xá»­ lÃ½ tab BÃ i dáº¡y
 */

import React from "react";
import { LessonTab } from "./LessonTab";
import type { LessonResult, LessonTask, ActionResult } from "@/lib/types";
import type { PPCTChuDe } from "@/lib/data/ppct-database";
import { PreFillDialog } from "./PreFillDialog";
import { getPreFillPrompt } from "@/lib/prompts/pre-fill-templates";

export interface LessonEngineProps {
  lessonGrade: string;
  setLessonGrade: (value: string) => void;
  selectedChuDeSo: string;
  setSelectedChuDeSo: (value: string) => void;
  lessonAutoFilledTheme: string;
  setLessonAutoFilledTheme: (value: string) => void;
  lessonDuration: string;
  setLessonDuration: (value: string) => void;
  selectedChuDe: PPCTChuDe | null;
  setSelectedChuDe: (value: PPCTChuDe | null) => void;
  setLessonMonth: (value: string) => void;
  shdcSuggestion: string;
  setShdcSuggestion: (value: string) => void;
  hdgdSuggestion: string;
  setHdgdSuggestion: (value: string) => void;
  shlSuggestion: string;
  setShlSuggestion: (value: string) => void;
  curriculumTasks: LessonTask[];
  distributeTimeForTasks: () => void;
  showCurriculumTasks: boolean;
  setShowCurriculumTasks: (value: boolean) => void;
  lessonTasks: LessonTask[];
  updateLessonTask: (id: string, field: any, value: any) => void;
  removeLessonTask: (id: string) => void;
  addLessonTask: () => void;
  lessonCustomInstructions: string;
  setLessonCustomInstructions: (value: string) => void;
  lessonResult: LessonResult | null;
  setLessonResult: (result: LessonResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
  isAuditing: boolean;
  onAudit: () => void;
  auditResult: string | null;
  auditScore: number;
  setSuccess: (msg: string | null) => void;
  setError: (msg: string | null) => void;
  success: string | null;
  error: string | null;
  lessonTopic: string;
  setLessonTopic: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  onRefineSection: (content: string, instruction: string, model?: string) => Promise<ActionResult>;
  onGenerateSection?: (section: any, context: any, stepInstruction?: string) => Promise<ActionResult>;
  lessonFullPlanMode: boolean;
  setLessonFullPlanMode: (value: boolean) => void;
  lessonFile: { mimeType: string; data: string; name: string } | null;
  setLessonFile: (file: { mimeType: string; data: string; name: string } | null) => void;
}

export function LessonEngine(props: LessonEngineProps) {
  const [preFillOpen, setPreFillOpen] = React.useState(false);
  const [preFillSection, setPreFillSection] = React.useState<string>("");
  const [preFillPrompt, setPreFillPrompt] = React.useState<string>("");

  const handlePreFillApply = (prompt: string) => {
    props.setLessonCustomInstructions(prompt);
    setPreFillOpen(false);
  };

  const handlePreFillOpen = (section: string) => {
    setPreFillSection(section);
    setPreFillPrompt(getPreFillPrompt(section, props.lessonAutoFilledTheme));
    setPreFillOpen(true);
  };

  // Event listener for pre-fill requests
  React.useEffect(() => {
    const handleOpenPreFill = (event: CustomEvent) => {
      handlePreFillOpen(event.detail);
    };

    window.addEventListener('openPreFill', handleOpenPreFill as EventListener);
    return () => {
      window.removeEventListener('openPreFill', handleOpenPreFill as EventListener);
    };
  }, [props.lessonAutoFilledTheme]);

  return (
    <>
      {/* Pre-fill Dialog */}
      <PreFillDialog
        open={preFillOpen}
        onOpenChange={setPreFillOpen}
        section={preFillSection}
        topic={props.lessonAutoFilledTheme}
        onApply={handlePreFillApply}
      />

      {/* Main Lesson Tab */}
      <LessonTab {...props} />
    </>
  );
}
