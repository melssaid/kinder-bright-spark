import { useQuery } from '@tanstack/react-query';
import { assessmentsService } from '../services/assessments.service';

export function useAssessments() {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentsService.list(),
  });
}

export function useStudentAssessments(studentId?: string) {
  return useQuery({
    queryKey: ['assessments', studentId],
    queryFn: () => assessmentsService.listByStudent(studentId as string),
    enabled: Boolean(studentId),
  });
}
