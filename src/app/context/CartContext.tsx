'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Cart, Product } from '@/app/graphql/types';
import { useQuery } from '@apollo/client';
import { GET_CART_HASH } from '@/app/graphql/queries';

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
  const { data, loading, error } = useQuery(GET_CART_HASH);
  const [cart, setCart] = useState<CartContextType>({
    hash: null,
    products: [],
  });

  useEffect(() => {
    if (!loading && !error) {
      setCart((prevCart: CartContextType) => ({
        ...prevCart,
        hash: data.getCart.hash,
      }));
    }
  }, [loading]);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCarts(): CartContextType {
  return useContext(CartContext);
}
