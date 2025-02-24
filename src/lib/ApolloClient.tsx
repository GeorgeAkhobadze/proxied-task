'use client';

import { ApolloLink, HttpLink, split } from '@apollo/client';
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';
import { ReactNode } from 'react';
import { setContext } from '@apollo/client/link/context';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

function makeClient() {
  const httpLink = new HttpLink({
    uri: 'https://take-home-be.onrender.com/api',
    fetchOptions: { cache: 'no-store' },
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'https://take-home-be.onrender.com/api',
      connectionParams: {
        authToken: localStorage.getItem('token'),
      },
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

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
            authLink.concat(splitLink),
          ])
        : authLink.concat(splitLink),
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
