import { gql } from '@apollo/client';

export const CART_ITEM_UPDATE_SUBSCRIPTION = gql`
  subscription Subscription {
    cartItemUpdate {
      event
      payload {
        product {
          _id
        }
        cartId
        quantity
      }
    }
  }
`;
