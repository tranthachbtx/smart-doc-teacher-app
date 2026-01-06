/**
 * 🎯 ENHANCED PDF EXTRACTOR - ARCHITECTURE 18.0
 * Trích xuất và phân tích nội dung PDF với AI intelligence
 */

import { extractPDFContent } from './simple-pdf-extractor';

export interface AnalyzedPDFContent {
  rawText: string;
  structure: PDFStructure;
  sections: PDFSection[];
  metadata: PDFMetadata;
  summary: string;
}

export interface PDFStructure {
  hasTableOfContents: boolean;
  hasSections: boolean;
  hasTables: boolean;
  hasImages: boolean;
  estimatedPages: number;
  contentDensity: 'low' | 'medium' | 'high';
  language: 'vi' | 'en' | 'mixed';
}

export interface PDFSection {
  title: string;
  content: string;
  type: 'introduction' | 'objective' | 'activity' | 'assessment' | 'conclusion' | 'other';
  confidence: number;
  startPosition: number;
  endPosition: number;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount?: number;
}

export class EnhancedPDFExtractor {
  /**
   * Trích xuất và phân tích PDF với AI intelligence
   */
  async extractAndAnalyzePDF(file: File): Promise<AnalyzedPDFContent> {
    console.log('[EnhancedPDF] Starting advanced analysis...');
    
    // Step 1: Extract raw text
    const rawText = await extractPDFContent(file);
    console.log(`[EnhancedPDF] Extracted ${rawText.length} characters`);
    
    // Step 2: Analyze structure
    const structure = await this.analyzePDFStructure(rawText);
    
    // Step 3: Extract sections
    const sections = await this.extractSections(rawText, structure);
    
    // Step 4: Extract metadata
    const metadata = await this.extractMetadata(rawText, file);
    
    // Step 5: Generate summary
    const summary = await this.generateSummary(rawText, sections);
    
    console.log(`[EnhancedPDF] Analysis complete: ${sections.length} sections found`);
    
    return {
      rawText,
      structure,
      sections,
      metadata,
      summary
    };
  }
  
  /**
   * Phân tích cấu trúc PDF
   */
  private async analyzePDFStructure(text: string): Promise<PDFStructure> {
    const lines = text.split('\n');
    
    // Detect structure elements
    const hasTableOfContents = this.detectTableOfContents(text);
    const hasSections = this.detectSections(text);
    const hasTables = this.detectTables(text);
    const hasImages = this.detectImages(text);
    
    // Estimate pages and density
    const estimatedPages = Math.ceil(text.length / 2000); // Rough estimate
    const contentDensity = this.calculateContentDensity(text);
    
    // Detect language
    const language = this.detectLanguage(text);
    
    return {
      hasTableOfContents,
      hasSections,
      hasTables,
      hasImages,
      estimatedPages,
      contentDensity,
      language
    };
  }
  
  /**
   * Trích xuất các phần chính của giáo án
   */
  private async extractSections(text: string, structure: PDFStructure): Promise<PDFSection[]> {
    const sections: PDFSection[] = [];
    
    // Define section patterns for Vietnamese educational documents
    const sectionPatterns = [
      { pattern: /mục tiêu|tiêu chí|kiến thức|năng lực/i, type: 'objective' as const },
      { pattern: /hoạt động|bài tập|thực hành|luyện tập/i, type: 'activity' as const },
      { pattern: /kiểm tra|đánh giá|bài kiểm tra|tự luận/i, type: 'assessment' as const },
      { pattern: /giới thiệu|tổng quan|đặt vấn đề/i, type: 'introduction' as const },
      { pattern: /kết luận|tổng kết|đánh giá chung/i, type: 'conclusion' as const }
    ];
    
    const lines = text.split('\n');
    let currentSection: PDFSection | null = null;
    let currentPosition = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      currentPosition += line.length + 1;
      
      // Check if this line starts a new section
      for (const { pattern, type } of sectionPatterns) {
        if (pattern.test(trimmedLine) && trimmedLine.length < 100) {
          // Save previous section if exists
          if (currentSection) {
            currentSection.endPosition = currentPosition;
            sections.push(currentSection);
          }
          
          // Start new section
          currentSection = {
            title: trimmedLine,
            content: '',
            type,
            confidence: this.calculateSectionConfidence(trimmedLine, pattern),
            startPosition: currentPosition,
            endPosition: 0
          };
          break;
        }
      }
      
      // Add content to current section
      if (currentSection && trimmedLine) {
        currentSection.content += trimmedLine + '\n';
      }
    }
    
    // Add the last section
    if (currentSection) {
      currentSection.endPosition = currentPosition;
      sections.push(currentSection);
    }
    
    return sections;
  }
  
  /**
   * Trích xuất metadata từ PDF
   */
  private async extractMetadata(text: string, file: File): Promise<PDFMetadata> {
    const metadata: PDFMetadata = {
      pageCount: Math.ceil(text.length / 2000)
    };
    
    // Try to extract title from first few lines
    const lines = text.split('\n').slice(0, 10);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 10 && trimmed.length < 100 && !trimmed.match(/\d+/)) {
        metadata.title = trimmed;
        break;
      }
    }
    
    // Extract file metadata
    metadata.creationDate = new Date();
    
    return metadata;
  }
  
  /**
   * Tạo summary cho nội dung PDF
   */
  private async generateSummary(text: string, sections: PDFSection[]): Promise<string> {
    if (sections.length === 0) {
      return text.substring(0, 500) + '...';
    }
    
    const summarySections = sections
      .filter(section => section.confidence > 0.7)
      .slice(0, 3)
      .map(section => `${section.title}: ${section.content.substring(0, 100)}...`)
      .join('\n');
    
    return summarySections || text.substring(0, 500) + '...';
  }
  
  /**
   * Helper methods
   */
  private detectTableOfContents(text: string): boolean {
    return /mục lục|table of contents|nội dung/i.test(text);
  }
  
  private detectSections(text: string): boolean {
    return /phần|chương|mục|section|chapter/i.test(text);
  }
  
  private detectTables(text: string): boolean {
    return /\|.*\|/g.test(text) || /┌|┬|┐|├|┼|┤|└|┴|┘/.test(text);
  }
  
  private detectImages(text: string): boolean {
    return /hình ảnh|image|ảnh|picture/i.test(text);
  }
  
  private calculateContentDensity(text: string): 'low' | 'medium' | 'high' {
    const wordsPerChar = text.split(/\s+/).length / text.length;
    if (wordsPerChar < 0.1) return 'low';
    if (wordsPerChar < 0.2) return 'medium';
    return 'high';
  }
  
  private detectLanguage(text: string): 'vi' | 'en' | 'mixed' {
    const vietnameseChars = text.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi);
    const vietnameseRatio = vietnameseChars ? vietnameseChars.length / text.length : 0;
    
    if (vietnameseRatio > 0.05) return 'vi';
    if (vietnameseRatio > 0.01) return 'mixed';
    return 'en';
  }
  
  private calculateSectionConfidence(line: string, pattern: RegExp): number {
    const match = line.match(pattern);
    if (!match) return 0;
    
    // Higher confidence for exact matches and proper formatting
    let confidence = 0.5;
    
    // Boost confidence for common section headers
    if (/^(mục tiêu|hoạt động|kiểm tra|đánh giá)$/i.test(line.trim())) {
      confidence += 0.3;
    }
    
    // Boost confidence for numbered sections
    if (/^\d+\./.test(line.trim())) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }
}

export const enhancedPDFExtractor = new EnhancedPDFExtractor();
