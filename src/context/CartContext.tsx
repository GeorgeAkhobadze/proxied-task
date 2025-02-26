'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/graphql/types';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_CART } from '@/graphql/queries';
import { CART_ITEM_UPDATE_SUBSCRIPTION } from '@/graphql/subscriptions';

interface CartContextType {
  cart: {
    hash: string | null;
    items: { product: Product; quantity: number; _id?: string }[];
  };
  setCart: React.Dispatch<React.SetStateAction<CartContextType['cart']>>;
  updatedItems: {
    product: Product;
    quantity: number;
    _id?: string;
    _typename: 'CartItem';
    action: 'ITEM_OUT_OF_STOCK' | 'ITEM_QUANTITY_UPDATED';
    updatedQuantity?: number;
  }[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  clearUpdates: () => void;
}

const defaultContextValue: CartContextType = {
  cart: {
    hash: null,
    items: [],
  },
  updatedItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  setCart: () => {},
  changeQuantity: () => {},
  clearUpdates: () => {},
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cartData } = useSubscription(CART_ITEM_UPDATE_SUBSCRIPTION);
  const [cart, setCart] = useState<CartContextType['cart']>({
    hash: null,
    items: [],
  });
  const { data, loading, error } = useQuery(GET_CART);
  const [updatedItems, setUpdatedItems] = useState<
    CartContextType['updatedItems']
  >([]);

  useEffect(() => {
    if (!loading && !error && data?.getCart) {
      setCart({
        hash: data.getCart.hash,
        items: data.getCart.items,
      });
    }
  }, [loading, data, error]);

  useEffect(() => {
    const targetItem = cart.items.find(
      (item) =>
        item.product._id === cartData.cartItemUpdate.payload.product._id,
    );

    if (cartData?.cartItemUpdate.event === 'ITEM_OUT_OF_STOCK') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setUpdatedItems((prev) => [
        ...prev,
        { ...targetItem, action: 'ITEM_OUT_OF_STOCK' },
      ]);

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (item) =>
            item.product._id !== cartData.cartItemUpdate.payload.product._id,
        ),
      }));
    } else if (
      cartData?.cartItemUpdate.event === 'ITEM_QUANTITY_UPDATED' &&
      targetItem &&
      targetItem?.quantity > cartData?.cartItemUpdate.payload.quantity
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setUpdatedItems((prev) => [
        ...prev,
        {
          ...targetItem,
          action: 'ITEM_QUANTITY_UPDATED',
          updatedQuantity: cartData?.cartItemUpdate.payload.quantity,
        },
      ]);

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.product._id === cartData?.cartItemUpdate.payload.product._id
            ? {
                ...item,
                quantity: cartData?.cartItemUpdate.payload.quantity,
                product: {
                  ...item.product,
                  availableQuantity: cartData?.cartItemUpdate.payload.quantity,
                },
              }
            : item,
        ),
      }));
    }
  }, [cartData]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: [...prevCart.items, { product, quantity: quantity }],
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.product._id !== productId),
    }));
  };

  const changeQuantity = (cartItemId: string, newQuantity: number) => {
    setCart((prevCart) => {
      return {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item,
        ),
      };
    });
  };

  const clearUpdates = () => {
    setUpdatedItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        updatedItems,
        clearUpdates,
        addToCart,
        removeFromCart,
        changeQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  return useContext(CartContext);
}
