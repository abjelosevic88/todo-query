import {
  matchQuery,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      queryFn: async ({ queryKey }) => {
        const { data } = await axios.get(queryKey[0] as string);
        return data;
      },
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient
        .invalidateQueries({
          predicate: (query) =>
            // invalidate all matching tags at once
            // or everything if no meta is provided
            mutation.meta?.invalidates?.some((queryKey) =>
              matchQuery({ queryKey }, query),
            ) ?? true,
        })
        .then(() => {});
    },
  }),
});

export async function defaultQueryFn<T>(route: string): Promise<T> {
  const { data } = await axios.get(route);
  return data;
}

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
