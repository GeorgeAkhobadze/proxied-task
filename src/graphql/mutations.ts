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

export const REMOVE_ITEM_MUTATION = gql`
  mutation RemoveItem($input: RemoveItemArgs!) {
    removeItem(input: $input) {
      hash
    }
  }
`;

export const UPDATE_ITEM_QUANTITY_MUTATION = gql`
  mutation UpdateItemQuantity($input: UpdateItemQuantityArgs!) {
    updateItemQuantity(input: $input) {
      hash
    }
  }
`;
