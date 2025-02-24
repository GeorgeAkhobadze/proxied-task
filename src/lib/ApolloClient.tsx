'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';
import { ReactNode } from 'react';
import { setContext } from '@apollo/client/link/context';

function makeClient() {
  const httpLink = new HttpLink({
    uri: 'https://take-home-be.onrender.com/api',
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink.concat(httpLink),
          ])
        : authLink.concat(httpLink),
  });
}

interface ApolloWrapperProps {
  children: ReactNode;
}

export function ApolloWrapper({ children }: ApolloWrapperProps) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
