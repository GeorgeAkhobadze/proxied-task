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

export const GET_CART = gql`
  query GetCart {
    getCart {
      hash
      items {
        _id
        product {
          title
          cost
          isArchived
          availableQuantity
          _id
        }
        quantity
      }
    }
  }
`;
