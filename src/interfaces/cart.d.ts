import { Product } from '@/graphql/types';

export interface CartItem {
  product: Product;
  quantity: number;
  _id?: string;
}

export interface UpdatedCartItem extends CartItem {
  _typename: 'CartItem';
  action: 'ITEM_OUT_OF_STOCK' | 'ITEM_QUANTITY_UPDATED';
  updatedQuantity?: number;
}

export interface Cart {
  hash: string | null;
  items: CartItem[];
}

export interface CartContextType {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  updatedItems: UpdatedCartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  clearUpdates: () => void;
}
