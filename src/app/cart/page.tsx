'use client';
import { useCart } from '@/context/CartContext';
import React from 'react';
import CartItem from '@/components/Product/CartItem';

export default function CartPage() {
  const { cart } = useCart();

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cart.items?.map((item) => (
          <CartItem
            product={item.product}
            quantity={item.quantity}
            cartItemId={item._id}
            key={item.product._id}
          />
        ))}
      </ul>
    </div>
  );
}
