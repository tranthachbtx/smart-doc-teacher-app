/**
 * ðŸŽ¯ PRE-FILL COMPONENT
 * GiÃºp ngÆ°á»i dÃ¹ng chá»n máº«u ná»™i dung trÆ°á»›c khi gá»­i AI
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
            Gá»£i Ã½ ná»™i dung cho {template.title}
          </DialogTitle>
          <DialogDescription>
            Sá»­ dá»¥ng máº«u nÃ y Ä‘á»ƒ giáº£m táº£i AI vÃ  Ä‘áº£m báº£o ná»™i dung cháº¥t lÆ°á»£ng cao.
            Báº¡n cÃ³ thá»ƒ chá»‰nh sá»­a trÆ°á»›c khi gá»­i cho Gemini Pro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Chá»§ Ä‘á»: {topic}
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
              Sao chÃ©p
            </Button>
            <Button onClick={handleApply} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Ãp dá»¥ng gá»£i Ã½
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
