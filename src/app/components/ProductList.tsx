'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/app/graphql/queries';
import { Product } from '@/app/graphql/types';
import { useProducts } from '@/app/context/ProductContext';
import ProductCard from '@/app/components/Product/ProductCard';

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

  if (!token)
    return (
      <p className="text-center text-gray-400">Checking authentication...</p>
    );
  if (loading)
    return <p className="text-center text-gray-400">Loading products...</p>;
  if (error)
    return (
      <p className="text-center text-red-400">
        Error loading products: {error.message}
      </p>
    );
  if (products.length <= 0)
    return <p className="text-center text-gray-400">No products available</p>;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </ul>
  );
};

export default ProductList;
