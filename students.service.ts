import { getStudents } from '@/lib/database';
import type { Student } from '@/shared/types/domain';

export const studentsService = {
  async list(): Promise<Student[]> {
    const rows = await getStudents();
    return rows.map((row) => ({
      id: row.id,
      teacherId: row.teacher_id,
      kindergartenId: row.kindergarten_id,
      name: row.name,
      age: row.age,
      gender: row.gender,
      createdAt: row.created_at,
    }));
  },
};
