/**
 * OPTIMIZED NCBH HOOK
 * Integrates all free tier optimizations:
 * - Local caching
 * - Batch processing  
 * - Rate limiting
 * - Progressive loading
 */

import { useState, useCallback, useEffect } from 'react';
import { localCache } from '@/lib/optimizations/local-cache';
import { batchProcessor, type NCBHRequest } from '@/lib/optimizations/batch-processor';
import { freeTierLimiter } from '@/lib/optimizations/free-tier-rate-limiter';
import type { NCBHResult } from '@/lib/types';

interface UseOptimizedNCBHOptions {
  grade: string;
  month: number;
  topic: string;
  sections?: string[];
  enableCache?: boolean;
  enableBatch?: boolean;
}

interface OptimizedNCBHState {
  data: Partial<NCBHResult>;
  loading: boolean;
  error: string | null;
  progress: number;
  cacheHit: boolean;
  batchId?: string;
}

export function useOptimizedNCBH({
  grade,
  month,
  topic,
  sections = ['ten_bai', 'ly_do_chon', 'muc_tieu', 'chuoi_hoat_dong', 'phuong_an_ho_tro', 'chia_se_nguoi_day', 'nhan_xet_nguoi_du', 'nguyen_nhan_giai_phap', 'bai_hoc_kinh_nghiem'],
  enableCache = true,
  enableBatch = true
}: UseOptimizedNCBHOptions) {
  const [state, setState] = useState<OptimizedNCBHState>({
    data: {},
    loading: false,
    error: null,
    progress: 0,
    cacheHit: false
  });

  // Check cache first
  const checkCache = useCallback(() => {
    if (!enableCache) return null;
    
    const cached = localCache.getCachedNCBH(grade, month, topic);
    if (cached) {
      setState(prev => ({
        ...prev,
        data: cached,
        cacheHit: true,
        loading: false,
        progress: 100
      }));
      return cached;
    }
    return null;
  }, [grade, month, topic, enableCache]);

  // Generate NCBH with optimizations
  const generateNCBH = useCallback(async () => {
    // Check cache first
    const cached = checkCache();
    if (cached) return cached;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      progress: 0,
      cacheHit: false
    }));

    try {
      let result: NCBHResult;

      if (enableBatch) {
        // Use batch processing
        result = await generateWithBatch();
      } else {
        // Use progressive loading
        result = await generateProgressive();
      }

      // Cache the result
      if (enableCache && result) {
        localCache.cacheNCBH(grade, month, topic, result);
      }

      setState(prev => ({
        ...prev,
        data: result,
        loading: false,
        progress: 100
      }));

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate NCBH';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [grade, month, topic, sections, enableCache, enableBatch, checkCache]);

  // Batch processing method
  const generateWithBatch = useCallback(async (): Promise<NCBHResult> => {
    const requestId = `ncbh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: NCBHRequest = {
      id: requestId,
      grade,
      month,
      topic,
      sections,
      priority: 'medium',
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      batchId: requestId,
      progress: 10
    }));

    const batchResult = await batchProcessor.addToBatch(request);

    if (!batchResult || !batchResult.results) {
      throw new Error('Batch processing failed');
    }

    setState(prev => ({
      ...prev,
      progress: 90
    }));

    return batchResult.results as NCBHResult;
  }, [grade, month, topic, sections]);

  // Progressive loading method
  const generateProgressive = useCallback(async (): Promise<NCBHResult> => {
    const result: Partial<NCBHResult> = {};
    const totalSections = sections.length;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      setState(prev => ({
        ...prev,
        progress: Math.round((i / totalSections) * 100)
      }));

      try {
        const sectionResult = await generateSection(section, result);
        (result as any)[section] = sectionResult;

        // Update state progressively
        setState(prev => ({
          ...prev,
          data: { ...result }
        }));

        // Wait between sections to respect rate limits
        if (i < sections.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

      } catch (sectionError) {
        console.error(`Failed to generate section ${section}:`, sectionError);
        // Continue with other sections
        (result as any)[section] = `Error generating ${section}: ${sectionError}`;
      }
    }

    return result as NCBHResult;
  }, [sections]);

  // Generate individual section
  const generateSection = useCallback(async (section: string, context: Partial<NCBHResult>): Promise<string> => {
    // Wait for rate limiter
    await freeTierLimiter.waitForToken();

    // Import gemini actions
    const { generateNCBH } = await import('@/lib/actions/gemini');

    // Create context-aware prompt
    const contextString = Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompt = `
Generate NCBH section "${section}" for:
- Grade: ${grade}
- Month: ${month}  
- Topic: ${topic}

Previous context:
${contextString}

Focus only on the "${section}" section. Provide detailed, professional content.
`;

    const response = await generateNCBH(grade, topic, prompt);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate section');
    }

    return (response.data as any)?.[section] || response.content || '';
  }, [grade, month, topic]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: {},
      loading: false,
      error: null,
      progress: 0,
      cacheHit: false
    });
  }, []);

  // Get rate limiter status
  const getRateLimitStatus = useCallback(() => {
    return freeTierLimiter.getStatus();
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return localCache.getCacheStats();
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    localCache.clearAllCache();
  }, []);

  // Auto-check cache on mount
  useEffect(() => {
    checkCache();
  }, [checkCache]);

  return {
    // State
    data: state.data,
    loading: state.loading,
    error: state.error,
    progress: state.progress,
    cacheHit: state.cacheHit,
    batchId: state.batchId,

    // Actions
    generateNCBH,
    reset,
    
    // Utilities
    getRateLimitStatus,
    getCacheStats,
    clearCache
  };
}
