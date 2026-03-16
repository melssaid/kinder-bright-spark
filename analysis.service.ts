import { supabase } from '@/integrations/supabase/client';
import type { AnalysisResult } from '../types';

export const analysisService = {
  async analyzeBehavior(payload: { studentName: string; studentAge: number; surveyData: Record<string, number | string>; locale: string; }): Promise<AnalysisResult> {
    const { data, error } = await supabase.functions.invoke('analyze-behavior', {
      body: payload,
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data.analysis as AnalysisResult;
  },
};