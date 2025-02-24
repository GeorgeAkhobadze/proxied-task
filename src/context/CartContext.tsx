'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/graphql/queries';

interface CartContextType {
  hash: string | null;
  items: { product: Product; quantity: number }[];
}

const defaultContextValue: CartContextType = {
  hash: null,
  items: [],
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(GET_CART);
  const [cart, setCart] = useState<CartContextType>({
    hash: null,
    items: [],
  });

  useEffect(() => {
    if (!loading && !error) {
      setCart({
        hash: data.getCart.hash,
        items: data.getCart.items,
      });
    }
  }, [loading]);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  return useContext(CartContext);
}
