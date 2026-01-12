/**
 * 🎯 SIMPLE JSON PARSER - BACK TO BASICS ARCHITECTURE 17.0
 * Parse JSON response từ AI một cách đơn giản và robust
 */

export interface LessonPlanData {
  title: string;
  grade: string;
  objectives: string[];
  activities: string[];
  assessment: string[];
  content?: string;
}

export function parseJSONResponse(aiResponse: string): LessonPlanData {
  // Try to parse as JSON directly first
  try {
    const parsed = JSON.parse(aiResponse);
    return validateAndNormalize(parsed);
  } catch (error) {
    // If direct parsing fails, try to extract JSON from the response
    const extracted = extractJSONFromText(aiResponse);
    if (extracted) {
      try {
        const parsed = JSON.parse(extracted);
        return validateAndNormalize(parsed);
      } catch (parseError) {
        console.warn('Failed to parse extracted JSON:', parseError);
      }
    }
    
    // If all JSON parsing fails, create a structured response from text
    return createStructuredResponse(aiResponse);
  }
}

function extractJSONFromText(text: string): string | null {
  // Try to find JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  // Try to find JSON in code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }
  
  return null;
}

function validateAndNormalize(data: any): LessonPlanData {
  return {
    title: data.title || data.tieuDe || 'Giáo án',
    grade: data.grade || data.lop || 'Không xác định',
    objectives: Array.isArray(data.objectives) ? data.objectives : 
               Array.isArray(data.mucTieu) ? data.mucTieu : 
               [data.objectives || data.mucTieu || 'Mục tiêu học tập'].filter(Boolean),
    activities: Array.isArray(data.activities) ? data.activities :
                Array.isArray(data.hoatDong) ? data.hoatDong :
                [data.activities || data.hoatDong || 'Hoạt động học tập'].filter(Boolean),
    assessment: Array.isArray(data.assessment) ? data.assessment :
                Array.isArray(data.danhGia) ? data.danhGia :
                [data.assessment || data.danhGia || 'Kiểm tra đánh giá'].filter(Boolean),
    content: data.content || data.noiDung || ''
  };
}

function createStructuredResponse(text: string): LessonPlanData {
  // Simple text parsing to extract structured information
  const lines = text.split('\n').filter(line => line.trim());
  
  const title = extractField(lines, ['tiêu đề', 'tên bài học', 'chủ đề']) || 'Giáo án';
  const grade = extractField(lines, ['lớp', 'khối']) || 'Không xác định';
  
  const objectives = extractList(lines, ['mục tiêu', 'mục tiêu học tập']) || ['Mục tiêu học tập'];
  const activities = extractList(lines, ['hoạt động', 'hoạt động dạy học']) || ['Hoạt động học tập'];
  const assessment = extractList(lines, ['đánh giá', 'kiểm tra']) || ['Kiểm tra đánh giá'];
  
  return {
    title,
    grade,
    objectives,
    activities,
    assessment,
    content: text
  };
}

function extractField(lines: string[], keywords: string[]): string | null {
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const keyword of keywords) {
      if (lowerLine.includes(keyword)) {
        // Extract content after the keyword
        const match = line.match(new RegExp(`${keyword}[:\\s]*(.+)`, 'i'));
        if (match) {
          return match[1].trim();
        }
      }
    }
  }
  return null;
}

function extractList(lines: string[], keywords: string[]): string[] | null {
  const items: string[] = [];
  let foundSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if we're entering a section
    for (const keyword of keywords) {
      if (lowerLine.includes(keyword)) {
        foundSection = true;
        continue;
      }
    }
    
    // If we're in a section, collect list items
    if (foundSection) {
      // Check for list markers (-, *, 1., 2., etc.)
      const listItem = line.match(/^[\s]*[-*•]\s*(.+)$|^\d+\.\s*(.+)$/);
      if (listItem) {
        items.push(listItem[1].trim());
      }
      // Stop collecting if we hit another section
      else if (line.includes(':') && !line.match(/^[\s]*[-*•]/)) {
        break;
      }
    }
  }
  
  return items.length > 0 ? items : null;
}
