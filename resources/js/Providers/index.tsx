import QueryProvider from '@/Providers/QueryProvider';
import { ReactNode } from 'react';

function Providers({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default Providers;
