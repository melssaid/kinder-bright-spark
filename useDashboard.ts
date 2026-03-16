import { useMemo } from 'react';
import { useStudents } from '@/features/students/hooks/useStudents';
import { useAssessments } from '@/features/assessments/hooks/useAssessments';

export function useDashboard() {
  const studentsQuery = useStudents();
  const assessmentsQuery = useAssessments();

  const data = useMemo(() => {
    const students = studentsQuery.data ?? [];
    const assessments = assessmentsQuery.data ?? [];
    const analyzed = assessments.filter((item) => Boolean(item.analysis)).length;

    return {
      students,
      assessments,
      totals: {
        students: students.length,
        assessments: assessments.length,
        analyzed,
      },
    };
  }, [studentsQuery.data, assessmentsQuery.data]);

  return {
    ...data,
    isLoading: studentsQuery.isLoading || assessmentsQuery.isLoading,
  };
}
