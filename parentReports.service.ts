import type { AnalysisResult } from '@/features/analysis/types';
import type { ParentReport } from '@/features/parents/types';

export const parentReportsService = {
  createDraft(input: { studentId: string; surveyId: string; locale: 'ar' | 'en'; analysis: AnalysisResult; }): ParentReport {
    return {
      id: crypto.randomUUID(),
      studentId: input.studentId,
      surveyId: input.surveyId,
      analysisSummary: input.analysis.summary,
      parentMessage: input.analysis.parentMessage,
      actionPlan: input.analysis.actionPlan,
      locale: input.locale,
      createdAt: new Date().toISOString(),
    };
  },
};
