import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      products {
        title
        cost
        isArchived
        availableQuantity
        _id
      }
    }
  }
`;

export const GET_CART_HASH = gql`
  query GetCart {
    getCart {
      hash
    }
  }
`;
