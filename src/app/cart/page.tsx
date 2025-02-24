'use client';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/Product/ProductCard';
import React from 'react';

export default function CartPage() {
  const cart = useCart();

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cart.items?.map((item) => (
          <ProductCard product={item.product} key={item.product._id} />
        ))}
      </ul>
    </div>
  );
}
