import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql",
});

// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("wais_access_token")
      : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link to handle auth errors and other GraphQL errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);

      // Handle 401 errors by redirecting to login
      if ("statusCode" in networkError && networkError.statusCode === 401) {
        // Clear stored tokens
        if (typeof window !== "undefined") {
          localStorage.removeItem("wais_access_token");
          localStorage.removeItem("wais_refresh_token");
          // Redirect to login page
          window.location.href = "/auth/login";
        }
      }
    }
  }
);

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Account: {
        keyFields: ["id"],
      },
      Payment: {
        keyFields: ["id"],
      },
      Transaction: {
        keyFields: ["id"],
      },
      User: {
        keyFields: ["id"],
      },
    },
  }),
  connectToDevTools: process.env.NODE_ENV === "development",
});

export default client;
