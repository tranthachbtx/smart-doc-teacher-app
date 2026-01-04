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
    return text
      // Remove markdown code blocks
      .replace(/```(?:json)?\s*/g, '')
      .replace(/```\s*$/g, '')
      // Remove common AI prefixes/suffixes
      .replace(/^(Here is|Here's|Below is|The following is)[^:]*:\s*/i, '')
      .replace(/\n*(This is|That's|It's)[^.]*\.\s*$/i, '')
      // Fix common JSON issues
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/:\s*([^",\[\{\}]+)([,\]\}])/g, ': "$1"$2')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Try different parsing strategies
   */
  private static tryParse(text: string, strategy: number): any {
    switch (strategy) {
      case 0:
        // Strategy 1: Standard JSON object
        return this.extractJSON(text, /\{[\s\S]*\}/);
      
      case 1:
        // Strategy 2: JSON array
        return this.extractJSON(text, /\[[\s\S]*\]/);
      
      case 2:
        // Strategy 3: JSON with markdown wrapper
        return this.extractJSON(text, /```json\s*\{[\s\S]*\}\s*```/);
      
      case 3:
        // Strategy 4: Multiple JSON objects
        const matches = text.match(/\{[^{}]*\}/g);
        if (matches && matches.length > 0) {
          return this.extractJSON(text, new RegExp(matches[0]));
        }
        break;
      
      case 4:
        // Strategy 5: Try to fix common JSON errors
        return this.tryFixJSON(text);
    }

    return null;
  }

  /**
   * Extract JSON using regex
   */
  private static extractJSON(text: string, regex: RegExp): any {
    const match = text.match(regex);
    if (!match) return null;

    const jsonStr = match[0];
    return JSON.parse(jsonStr);
  }

  /**
   * Try to fix common JSON errors
   */
  private static tryFixJSON(text: string): any {
    // Find JSON-like structure
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    let jsonStr = jsonMatch[0];

    // Fix trailing commas
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

    // Fix missing quotes around keys
    jsonStr = jsonStr.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

    // Fix missing quotes around string values
    jsonStr = jsonStr.replace(/:\s*([^",\[\{\}\s][^",\[\{\}]*?)([,\]\}])/g, ': "$1"$2');

    try {
      return JSON.parse(jsonStr);
    } catch (e) {
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
