'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Product } from '@/graphql/types';
import { GET_CART } from '@/graphql/queries';
import { CART_ITEM_UPDATE_SUBSCRIPTION } from '@/graphql/subscriptions';
import { Cart, UpdatedCartItem, CartContextType } from '@/interfaces/cart';

const defaultContextValue: CartContextType = {
  cart: { hash: null, items: [] },
  updatedItems: [],
  setCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  changeQuantity: () => {},
  clearUpdates: () => {},
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: subscriptionData } = useSubscription(
    CART_ITEM_UPDATE_SUBSCRIPTION,
  );
  const { data, loading, error } = useQuery(GET_CART);

  const [cart, setCart] = useState<Cart>({ hash: null, items: [] });
  const [updatedItems, setUpdatedItems] = useState<UpdatedCartItem[]>([]);

  useEffect(() => {
    if (loading || error || !data?.getCart) return;
    setCart({ hash: data.getCart.hash, items: data.getCart.items });
  }, [loading, error, data]);

  useEffect(() => {
    if (!subscriptionData?.cartItemUpdate) return;

    const { event, payload } = subscriptionData.cartItemUpdate;
    const targetItem = cart.items.find(
      (item) => item.product._id === payload.product._id,
    );

    if (event === 'ITEM_OUT_OF_STOCK' && targetItem) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setUpdatedItems((prev) => [
        ...prev,
        { ...targetItem, action: 'ITEM_OUT_OF_STOCK' },
      ]);

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (item) => item.product._id !== payload.product._id,
        ),
      }));
    }

    if (
      event === 'ITEM_QUANTITY_UPDATED' &&
      targetItem &&
      targetItem.quantity > payload.quantity
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setUpdatedItems((prev) => [
        ...prev,
        {
          ...targetItem,
          action: 'ITEM_QUANTITY_UPDATED',
          updatedQuantity: payload.quantity,
        },
      ]);

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.product._id === payload.product._id
            ? {
                ...item,
                quantity: payload.quantity,
                product: {
                  ...item.product,
                  availableQuantity: payload.quantity,
                },
              }
            : item,
        ),
      }));
    }
  }, [subscriptionData, cart.items]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => ({
      ...prev,
      items: [...prev.items, { product, quantity }],
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.product._id !== productId),
    }));
  };

  const changeQuantity = (cartItemId: string, newQuantity: number) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item,
      ),
    }));
  };

  const clearUpdates = () => setUpdatedItems([]);

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
