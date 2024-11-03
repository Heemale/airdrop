'use client';
import {
  QueryClient,
  QueryClientProvider as ClientProvider,
} from '@tanstack/react-query';

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return <ClientProvider client={queryClient}>{children}</ClientProvider>;
}
