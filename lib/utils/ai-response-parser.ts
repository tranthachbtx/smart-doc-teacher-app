/**
 * 🛡️ HARDENED JSON PARSER v2.0
 * Chuyên dụng để parse JSON từ AI response một cách ổn định
 */

export interface ParseOptions {
  fallbackKey?: string;
  strict?: boolean;
  maxAttempts?: number;
}

export class AIResponseParser {
  private static readonly DEFAULT_OPTIONS: ParseOptions = {
    fallbackKey: 'content',
    strict: false,
    maxAttempts: 5
  };

  /**
   * Parse JSON từ AI response với nhiều chiến lược
   */
  static parse(text: string, options: ParseOptions = {}): any {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    if (!text || typeof text !== 'string') {
      return opts.fallbackKey ? { [opts.fallbackKey]: '' } : {};
    }

    // Clean text
    const cleanText = this.cleanText(text);

    // Try different parsing strategies
    for (let attempt = 0; attempt < opts.maxAttempts!; attempt++) {
      try {
        const result = this.tryParse(cleanText, attempt);
        if (result) return result;
      } catch (e) {
        // Continue to next strategy
      }
    }

    // All strategies failed - return fallback
    if (opts.fallbackKey) {
      return { [opts.fallbackKey]: cleanText.trim() };
    }

    if (opts.strict) {
      throw new Error(`Failed to parse JSON after ${opts.maxAttempts} attempts`);
    }

    return {};
  }

  /**
   * Clean text before parsing
   */
  private static cleanText(text: string): string {
    if (!text) return "";

    let cleaned = text.trim();

    // 1. Remove Markdown code block syntax
    cleaned = cleaned.replace(/^```(?:json)?/gm, '').replace(/```$/gm, '');

    // 2. Extract content between the first { and the last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    return cleaned;
  }

  /**
   * Try different parsing strategies
   */
  private static tryParse(text: string, strategy: number): any {
    switch (strategy) {
      case 0:
        // Strategy 1: Direct parse
        try {
          return JSON.parse(text);
        } catch (e) {
          return null;
        }

      case 1:
        // Strategy 2: Fix trailing commas - very common in AI output
        try {
          const fixed = text.replace(/,\s*([}\]])/g, '$1');
          return JSON.parse(fixed);
        } catch (e) {
          return null;
        }

      case 2:
        // Strategy 3: Fix unquoted keys
        try {
          const fixed = text.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
          return JSON.parse(fixed);
        } catch (e) {
          return null;
        }

      case 3:
        // Strategy 4: Handle escaped newlines that are actual newlines
        try {
          const fixed = text.replace(/\n/g, "\\n");
          // But wait, we only want to escape newlines inside quotes. 
          // This is complex, let's try a simpler approach if the above fails.
          return null;
        } catch (e) {
          return null;
        }

      case 4:
        // Strategy 5: Advanced cleanup
        return this.tryFixJSON(text);
    }

    return null;
  }

  /**
   * Extract JSON using regex (Deprecated in favor of direct brace finding)
   */
  private static extractJSON(text: string, regex: RegExp): any {
    const match = text.match(regex);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      return null;
    }
  }

  /**
   * Try to fix common JSON errors
   */
  private static tryFixJSON(text: string): any {
    let jsonStr = text;

    // Remove control characters
    jsonStr = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    // Fix common AI mistakes
    // - Replace smart quotes
    jsonStr = jsonStr.replace(/[\u201C\u201D]/g, '"');

    // Try to fix missing closing braces if close enough
    const openBraces = (jsonStr.match(/\{/g) || []).length;
    const closeBraces = (jsonStr.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      jsonStr += "}".repeat(openBraces - closeBraces);
    }

    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      // Last resort: deep repair or partial extraction
      return null;
    }
  }

  /**
   * Parse specific response types
   */
  static parseLessonResult(text: string): any {
    const result = this.parse(text, { fallbackKey: 'content' });

    // Ensure required fields for LessonResult
    if (typeof result === 'object' && result !== null) {
      return {
        muc_tieu_kien_thuc: result.muc_tieu_kien_thuc || '',
        hoat_dong_khoi_dong: result.hoat_dong_khoi_dong || '',
        hoat_dong_kham_pha: result.hoat_dong_kham_pha || '',
        hoat_dong_luyen_tap: result.hoat_dong_luyen_tap || '',
        hoat_dong_van_dung: result.hoat_dong_van_dung || '',
        huong_dan_ve_nha: result.huong_dan_ve_nha || '',
        shdc: result.shdc || '',
        shl: result.shl || '',
        ho_so_day_hoc: result.ho_so_day_hoc || '',
        ...result
      };
    }

    return result;
  }

  static parseMeetingResult(text: string): any {
    return this.parse(text, { fallbackKey: 'noi_dung' });
  }

  static parseEventResult(text: string): any {
    return this.parse(text, { fallbackKey: 'ke_hoach' });
  }

  static parseNCBHResult(text: string): any {
    return this.parse(text, { fallbackKey: 'noi_dung' });
  }

  static parseAssessmentResult(text: string): any {
    return this.parse(text, { fallbackKey: 'ke_hoach_danh_gia' });
  }
}

// Export convenience functions
export const parseResilient = (text: string, key?: string) => {
  return AIResponseParser.parse(text, { fallbackKey: key });
};

export const parseLessonResult = (text: string) => {
  return AIResponseParser.parseLessonResult(text);
};

export const parseMeetingResult = (text: string) => {
  return AIResponseParser.parseMeetingResult(text);
};

export const parseEventResult = (text: string) => {
  return AIResponseParser.parseEventResult(text);
};

export const parseNCBHResult = (text: string) => {
  return AIResponseParser.parseNCBHResult(text);
};

export const parseAssessmentResult = (text: string) => {
  return AIResponseParser.parseAssessmentResult(text);
};
