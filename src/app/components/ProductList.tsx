'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/app/graphql/queries';
import { Product } from '@/app/graphql/types';
import { useProducts } from '@/app/context/ProductContext';

const ProductList: React.FC = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { setProducts, products } = useProducts();

  const { data, loading, error } = useQuery<{
    getProducts: { products: Product[] };
  }>(GET_PRODUCTS, {
    skip: !token,
  });

  useEffect(() => {
    if (data?.getProducts?.products.length) {
      setProducts(data.getProducts.products);
    }
  }, [data, setProducts]);

  if (!token) return <p>Checking authentication...</p>;
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;
  if (products.length <= 0) return <p>No products available</p>;

  return (
    <ul>
      {products.map((product, index) => (
        <li key={index}>
          {product.title} - ${product.cost}
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
