'use client';
import { createContext, useContext, useState } from 'react';
import { Product } from '@/graphql/types';

interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const defaultContextValue: ProductContextType = {
  products: [],
  setProducts: () => {},
};

const ProductContext = createContext<ProductContextType>(defaultContextValue);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextType {
  return useContext(ProductContext);
}
