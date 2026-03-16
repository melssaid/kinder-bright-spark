import type { Parent, StudentGuardian } from '../types';

export const parentsService = {
  async list(): Promise<Parent[]> {
    return [];
  },

  async listGuardiansByStudent(studentId: string): Promise<StudentGuardian[]> {
    void studentId;
    return [];
  },
};
