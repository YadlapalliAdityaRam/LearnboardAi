import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const baseUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
  : 'http://localhost:5000';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${baseUrl}/graphql`,
  }),
  cache: new InMemoryCache(),
});
