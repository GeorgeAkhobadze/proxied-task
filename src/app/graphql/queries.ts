import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      products {
        title
        cost
      }
    }
  }
`;
