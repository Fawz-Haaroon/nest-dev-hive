
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export const useSearch = (searchTerm: string) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return useQuery({
    queryKey: ['search', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm.trim()) return [];
      
      const { data, error } = await supabase
        .rpc('search_projects', { search_term: debouncedTerm });

      if (error) throw error;
      return data;
    },
    enabled: debouncedTerm.length > 2,
  });
};
