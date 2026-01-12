/**
 * 🎯 PRE-FILL COMPONENT
 * Giúp người dùng chọn mẫu nội dung trước khi gửi AI
 */

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Lightbulb, Sparkles } from "lucide-react";
import { PRE_FILL_TEMPLATES, getPreFillPrompt } from "@/lib/prompts/pre-fill-templates";

interface PreFillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
  topic: string;
  onApply: (prompt: string) => void;
}

export function PreFillDialog({ open, onOpenChange, section, topic, onApply }: PreFillDialogProps) {
  const template = PRE_FILL_TEMPLATES[section as keyof typeof PRE_FILL_TEMPLATES];
  
  const handleApply = () => {
    const prompt = getPreFillPrompt(section, topic);
    onApply(prompt);
    onOpenChange(false);
  };

  const handleCopy = () => {
    const prompt = getPreFillPrompt(section, topic);
    navigator.clipboard.writeText(prompt);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Gợi ý nội dung cho {template.title}
          </DialogTitle>
          <DialogDescription>
            Sử dụng mẫu này để giảm tải AI và đảm bảo nội dung chất lượng cao.
            Bạn có thể chỉnh sửa trước khi gửi cho Gemini Pro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Chủ đề: {topic}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {section.toUpperCase()}
            </Badge>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap">
              {template.content}
            </pre>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Sao chép
            </Button>
            <Button onClick={handleApply} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Áp dụng gợi ý
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
