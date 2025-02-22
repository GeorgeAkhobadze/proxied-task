import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register {
    register {
      _id
      token
    }
  }
`;
