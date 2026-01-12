
/**
 * 🎯 ADVANCED AI PROCESSOR - ARCHITECTURE 18.0
 * Xử lý AI với database integration và multi-step reasoning
 */

import { callAI } from './actions/gemini';
import { JSON_SYSTEM_PROMPT } from './prompts/system-prompts';
import { AnalyzedPDFContent } from './enhanced-pdf-extractor';
import { LessonContext } from './database-integration-service';
import { SmartPromptService, SmartPromptData } from './services/smart-prompt-service';

export interface StructuredLessonPlan {
  // Basic info
  ten_bai: string;
  muc_tieu_kien_thuc: string;
  muc_tieu_nang_luc: string;
  muc_tieu_pham_chat: string;

  // Resources
  thiet_bi_day_hoc: string;
  shdc: string;
  shl: string;

  // Activities with 2-column structure
  hoat_dong_khoi_dong: string;
  hoat_dong_kham_pha: string;
  hoat_dong_luyen_tap: string;
  hoat_dong_van_dung: string;

  // Additional
  ho_so_day_hoc: string;
  huong_dan_ve_nha: string;

  // Metadata
  ai_generated: boolean;
  confidence: number;
  processing_time: number;
  database_context_used: boolean;
  processing_steps?: ProcessingStep[];
}

export interface ProcessingStep {
  step: number;
  name: string;
  input: any;
  output: any;
  confidence: number;
  duration: number;
}

export class AdvancedAIProcessor {
  /**
   * Xử lý giáo án với AI và database integration
   */
  async processLessonWithAI(
    pdfContent: AnalyzedPDFContent,
    context: LessonContext,
    oldLessonContent?: string
  ): Promise<StructuredLessonPlan> {
    console.log('[AdvancedAI] Starting multi-step AI processing...');
    const startTime = Date.now();

    const processingSteps: ProcessingStep[] = [];

    try {
      // Step 1: Extract learning objectives
      const step1 = await this.extractLearningObjectives(pdfContent, context);
      processingSteps.push(step1);

      // Step 2: Generate activities
      const step2 = await this.generateActivities(pdfContent, context, step1.output);
      processingSteps.push(step2);

      // Step 3: Create assessment plan
      const step3 = await this.createAssessmentPlan(pdfContent, context, step1.output, step2.output);
      processingSteps.push(step3);

      // Step 4: Generate complete lesson plan
      const step4 = await this.generateCompleteLesson(step1.output, step2.output, step3.output, context, oldLessonContent);
      processingSteps.push(step4);

      const processingTime = Date.now() - startTime;
      console.log(`[AdvancedAI] Processing completed in ${processingTime}ms`);

      return {
        ...step4.output,
        ai_generated: true,
        confidence: this.calculateOverallConfidence(processingSteps),
        processing_time: processingTime,
        database_context_used: true,
        processing_steps: processingSteps
      } as StructuredLessonPlan;

    } catch (error: any) {
      console.error('[AdvancedAI] Processing failed:', error);
      throw new Error(`AI processing failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Step 1: Extract learning objectives from PDF and context
   */
  private async extractLearningObjectives(
    pdfContent: AnalyzedPDFContent,
    context: LessonContext
  ): Promise<ProcessingStep> {
    const startTime = Date.now();

    const prompt = `
# STEP 1: EXTRACT LEARNING OBJECTIVES

## PDF CONTENT ANALYSIS
${pdfContent.summary}

## DATABASE CONTEXT
Grade: ${context.grade}
Topic: ${context.topic}
Educational Focus: ${context.educationalContext.trongTamPhatTrien}

## TASK
Extract and synthesize learning objectives from the PDF content and database context.
Focus on:
1. Knowledge objectives (Kiến thức)
2. Competency objectives (Năng lực)  
3. Character objectives (Phẩm chất)

## OUTPUT FORMAT
Return a JSON object with:
{
  "objectives": {
    "knowledge": "Kiến thức cần đạt",
    "competency": "Năng lực cần hình thành",
    "character": "Phẩm chất cần rèn luyện"
  },
  "confidence": 0.9
}
    `;

    try {
      const response = await callAI(prompt, "gemini-1.5-flash");
      const result = this.parseAIResponse(response);

      return {
        step: 1,
        name: 'Extract Learning Objectives',
        input: { pdfSummary: pdfContent.summary, context },
        output: result,
        confidence: result.confidence || 0.8,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      throw new Error(`Step 1 failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Step 2: Generate learning activities
   */
  private async generateActivities(
    pdfContent: AnalyzedPDFContent,
    context: LessonContext,
    objectives: any
  ): Promise<ProcessingStep> {
    const startTime = Date.now();

    const prompt = `
# STEP 2: GENERATE LEARNING ACTIVITIES

## OBJECTIVES FROM STEP 1
${JSON.stringify(objectives, null, 2)}

## PDF CONTENT
${pdfContent.summary}

## DATABASE CONTEXT
${JSON.stringify(context.smartPrompts, null, 2)}

## TASK
Generate 4 learning activities following Thông tư 5512:
1. Hoạt động khởi động
2. Hoạt động khám phá  
3. Hoạt động luyện tập
4. Hoạt động vận dụng

Each activity MUST use 2-column format:
- {{cot_1}}: Teacher actions
- {{cot_2}}: Student actions

## OUTPUT FORMAT
Return a JSON object with:
{
  "activities": {
    "khoi_dong": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV... {{cot_2}} HS...",
    "kham_pha": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV... {{cot_2}} HS...",
    "luyen_tap": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV... {{cot_2}} HS...",
    "van_dung": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV... {{cot_2}} HS..."
  },
  "confidence": 0.9
}
    `;

    try {
      const response = await callAI(prompt, "gemini-1.5-flash");
      const result = this.parseAIResponse(response);

      return {
        step: 2,
        name: 'Generate Learning Activities',
        input: { objectives, pdfSummary: pdfContent.summary, context },
        output: result,
        confidence: result.confidence || 0.8,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      throw new Error(`Step 2 failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Step 3: Create assessment plan
   */
  private async createAssessmentPlan(
    pdfContent: AnalyzedPDFContent,
    context: LessonContext,
    objectives: any,
    activities: any
  ): Promise<ProcessingStep> {
    const startTime = Date.now();

    const prompt = `
# STEP 3: CREATE ASSESSMENT PLAN

## OBJECTIVES AND ACTIVITIES
Objectives: ${JSON.stringify(objectives, null, 2)}
Activities: ${JSON.stringify(activities, null, 2)}

## DATABASE CONTEXT
Assessment Tools: ${context.smartPrompts.assessmentTools}

## TASK
Create comprehensive assessment plan including:
1. Classroom observation (Quan trắc)
2. Performance assessment (Đánh giá)
3. Formative assessment tools
4. Summative assessment criteria

## OUTPUT FORMAT
Return a JSON object with:
{
  "assessment": {
    "quan_trac": "Tiêu chí quan trắc trong giờ học",
    "danh_gia": "Tiêu chí đánh giá sản phẩm học tập",
    "cong_cu": "Công cụ đánh giá (rubric, phiếu học tập)",
    "tieuchi": "Tiêu chí đánh giá theo 4 mức độ"
  },
  "confidence": 0.9
}
    `;

    try {
      const response = await callAI(prompt, "gemini-1.5-flash");
      const result = this.parseAIResponse(response);

      return {
        step: 3,
        name: 'Create Assessment Plan',
        input: { objectives, activities, context },
        output: result,
        confidence: result.confidence || 0.8,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      throw new Error(`Step 3 failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Step 4: Generate complete lesson plan
   */
  private async generateCompleteLesson(
    objectives: any,
    activities: any,
    assessment: any,
    context: LessonContext,
    oldLessonContent?: string
  ): Promise<ProcessingStep> {
    const startTime = Date.now();

    // Build enhanced prompt with database integration
    // FIXED: Argument order swapped to match SmartPromptService signature
    const enhancedPrompt = SmartPromptService.buildFinalSmartPrompt(
      oldLessonContent || "",
      context.smartPrompts as unknown as SmartPromptData // Ensure strict type safety via casting if needed
    );

    // Add step results to prompt
    const stepResults = `
## PREVIOUS STEP RESULTS
### Step 1 - Objectives:
${JSON.stringify(objectives, null, 2)}

### Step 2 - Activities:
${JSON.stringify(activities, null, 2)}

### Step 3 - Assessment:
${JSON.stringify(assessment, null, 2)}
`;

    const finalPrompt = enhancedPrompt + '\n\n' + stepResults + '\n\n' + `
## FINAL TASK
Based on all the above analysis and database context, generate the complete lesson plan in the specified JSON format.
Ensure all activities use {{cot_1}} and {{cot_2}} markers properly.
    `;

    try {
      // Step 4 requires JSON output for the StructuredLessonPlan
      const response = await callAI(finalPrompt, "gemini-1.5-flash", undefined, JSON_SYSTEM_PROMPT);
      const result = this.parseAIResponse(response);

      return {
        step: 4,
        name: 'Generate Complete Lesson Plan',
        input: { objectives, activities, assessment, context, oldLessonContent },
        output: result,
        confidence: result.confidence || 0.9,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      throw new Error(`Step 4 failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Parse AI response with fallback
   */
  private parseAIResponse(response: string): any {
    try {
      // Try direct JSON parse
      return JSON.parse(response);
    } catch (error) {
      // Try to extract JSON from text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          // Fallback to structured text parsing
          return this.parseTextResponse(response);
        }
      }

      // Final fallback
      return this.parseTextResponse(response);
    }
  }

  /**
   * Parse text response as fallback
   */
  private parseTextResponse(response: string): any {
    return {
      confidence: 0.5,
      raw_response: response,
      note: "Parsed from text response"
    };
  }

  /**
   * Calculate overall confidence
   */
  private calculateOverallConfidence(steps: ProcessingStep[]): number {
    const totalConfidence = steps.reduce((sum, step) => sum + step.confidence, 0);
    return totalConfidence / steps.length;
  }
}

export const advancedAIProcessor = new AdvancedAIProcessor();
