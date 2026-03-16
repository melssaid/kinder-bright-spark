import { useQuery } from '@tanstack/react-query';
import { studentsService } from '../services/students.service';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentsService.list(),
  });
}
