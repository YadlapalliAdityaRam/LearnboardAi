import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/graphql` : 'http://localhost:5000/graphql',
  }),
  cache: new InMemoryCache(),
});
