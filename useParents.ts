import { useQuery } from '@tanstack/react-query';
import { parentsService } from '../services/parents.service';

export function useParents() {
  return useQuery({
    queryKey: ['parents'],
    queryFn: () => parentsService.list(),
  });
}
