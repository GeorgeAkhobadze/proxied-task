"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    InMemoryCache,
    ApolloClient,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import {ReactNode} from "react";

function makeClient() {
    const httpLink = new HttpLink({
        uri: "https://take-home-be.onrender.com/api",
        fetchOptions: { cache: "no-store" },
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    httpLink,
                ])
                : httpLink,
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