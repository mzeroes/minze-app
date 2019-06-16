import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { GRAPHQL_ENDPOINT } from '../config';

const client = (token?: any) => {
  const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
};

export default client;
