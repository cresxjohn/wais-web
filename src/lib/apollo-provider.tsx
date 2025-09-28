"use client";

import { ApolloProvider } from "@apollo/client/react";
import client from "./apollo-client";

export function ApolloGraphQLProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
