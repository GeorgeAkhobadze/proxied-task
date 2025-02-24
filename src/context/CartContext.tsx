'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/graphql/queries';

interface CartContextType {
  hash: string | null;
  products: Product[];
}

const defaultContextValue: CartContextType = {
  hash: null,
  products: [],
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(GET_CART);
  const [cart, setCart] = useState<CartContextType>({
    hash: null,
    products: [],
  });

  useEffect(() => {
    if (!loading && !error) {
      setCart(data.getCart);
    }
  }, [loading]);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCarts(): CartContextType {
  return useContext(CartContext);
}
