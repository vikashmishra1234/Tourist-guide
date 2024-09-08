import { useQuery } from '@tanstack/react-query';
import { getPriests } from '../Services/Apis';

export const useFetchPriests = () => {
  return useQuery({
    queryKey: ['priests'],
    queryFn: async () => {
      const res = await getPriests();
      if (res) return res.priests;
      throw new Error('Error fetching priests');
    },
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10,
  });
};
