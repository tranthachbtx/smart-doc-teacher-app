/**
 * 🏛️ MEETING ENGINE COMPONENT
 * Xử lý tab Biên bản họp
 */

import React from "react";
import { MeetingTab } from "./MeetingTab";
import type { MeetingResult } from "@/lib/types";

export interface MeetingEngineProps {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedSession: string;
  setSelectedSession: (value: string) => void;
  meetingKeyContent: string;
  setMeetingKeyContent: (value: string) => void;
  meetingConclusion: string;
  setMeetingConclusion: (value: string) => void;
  meetingResult: MeetingResult | null;
  setMeetingResult: (result: MeetingResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
}

export function MeetingEngine(props: MeetingEngineProps) {
  return <MeetingTab {...props} />;
}
