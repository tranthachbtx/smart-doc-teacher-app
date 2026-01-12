/**
 * ðŸŽ‰ EVENT ENGINE COMPONENT
 * Xá»­ lÃ½ tab Ngoáº¡i khÃ³a
 */

import React from "react";
import { EventTab } from "./EventTab";
import type { EventResult } from "@/lib/types";

export interface EventEngineProps {
  selectedGradeEvent: string;
  setSelectedGradeEvent: (value: string) => void;
  selectedEventMonth: string;
  setSelectedEventMonth: (value: string) => void;
  autoFilledTheme: string;
  setAutoFilledTheme: (value: string) => void;
  eventType: string;
  setEventType: (value: string) => void;
  eventBudget: string;
  setEventBudget: (value: string) => void;
  eventChecklist: string;
  setEventChecklist: (value: string) => void;
  eventEvaluation: string;
  setEventEvaluation: (value: string) => void;
  eventResult: EventResult | null;
  setEventResult: (result: EventResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
  eventCustomInstructions: string;
  setEventCustomInstructions: (value: string) => void;
}

export function EventEngine(props: EventEngineProps) {
  return <EventTab {...props} />;
}
