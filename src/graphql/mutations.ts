import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register {
    register {
      _id
      token
    }
  }
`;

export const ADD_ITEM_MUTATION = gql`
  mutation AddItem($input: AddItemArgs!) {
    addItem(input: $input) {
      hash
    }
  }
`;
