import { addSurvey, getStudentSurveys, getSurveys, updateSurveyAnalysis } from '@/lib/database';
import type { Survey } from '@/shared/types/domain';

function adaptSurvey(row: any): Survey {
  return {
    id: row.id,
    studentId: row.student_id,
    teacherId: row.teacher_id,
    date: row.date,
    answers: row.answers,
    analysis: row.analysis,
  };
}

export const assessmentsService = {
  async list(): Promise<Survey[]> {
    const rows = await getSurveys();
    return rows.map(adaptSurvey);
  },

  async listByStudent(studentId: string): Promise<Survey[]> {
    const rows = await getStudentSurveys(studentId);
    return rows.map(adaptSurvey);
  },

  async create(payload: { studentId: string; teacherId: string; answers: Record<string, number | string> }) {
    const row = await addSurvey({ student_id: payload.studentId, teacher_id: payload.teacherId, answers: payload.answers });
    return row ? adaptSurvey(row) : null;
  },

  async saveAnalysis(surveyId: string, analysis: unknown) {
    await updateSurveyAnalysis(surveyId, analysis);
  },
};
