'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/graphql/types';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_CART } from '@/graphql/queries';
import { CART_ITEM_UPDATE_SUBSCRIPTION } from '@/graphql/subscriptions';

interface CartContextType {
  cart: {
    hash: string | null;
    items: { product: Product; quantity: number }[];
  };
  addToCart: (product: Product) => void;
}

const defaultContextValue: CartContextType = {
  cart: {
    hash: null,
    items: [],
  },
  addToCart: () => {},
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(GET_CART);
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useSubscription(CART_ITEM_UPDATE_SUBSCRIPTION);

  const [cart, setCart] = useState<CartContextType['cart']>({
    hash: null,
    items: [],
  });

  useEffect(() => {
    if (!loading && !error && data?.getCart) {
      setCart({
        hash: data.getCart.hash,
        items: data.getCart.items,
      });
    }
  }, [loading, data, error]);

  useEffect(() => {
    if (
      cartData?.cartItemUpdate.event === 'ITEM_OUT_OF_STOCK' &&
      cartData?.cartItemUpdate.payload?.product?._id
    ) {
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (item) =>
            item.product._id !== cartData.cartItemUpdate.payload.product._id,
        ),
      }));
    }
  }, [cartData]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: [...prevCart.items, { product, quantity: 1 }],
    }));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  return useContext(CartContext);
}
