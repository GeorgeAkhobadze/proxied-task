import React, { useState } from 'react';
import { Product } from '@/graphql/types';
import { useCartItemActions } from './CartItemActions';

interface ProductProps {
  product: Product;
  quantity: number;
  cartItemId: string | undefined;
}

const CartItem = ({ product, quantity, cartItemId }: ProductProps) => {
  const [displayedQuantity, setDisplayedQuantity] = useState(quantity);

  const {
    handleItemRemove,
    handleQuantityChange,
    updateQuantityLoading,
    removeItemLoading,
  } = useCartItemActions(product, cartItemId, setDisplayedQuantity, quantity);

  return (
    <li className="group border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 transition-transform transform hover:bg-gray-700 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-200">{product.title}</h2>
      <p className="text-gray-400">
        Price: <span className="text-green-400 font-bold">${product.cost}</span>
      </p>
      <button
        className="absolute top-2 right-2 bg-red-500 rounded w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        onClick={handleItemRemove}
      >
        <img src={'./trash-icon.svg'} className="w-6 h-6" />
      </button>
      <p className="text-gray-500">Stock: {product.availableQuantity}</p>
      <label className="text-gray-300 flex mt-auto items-center justify-between">
        Quantity:
        <select
          disabled={updateQuantityLoading || removeItemLoading}
          className="self-end p-2 bg-gray-900 text-gray-200 rounded px-4"
          value={displayedQuantity}
          onChange={handleQuantityChange}
        >
          {Array.from(
            { length: product.availableQuantity },
            (_, i) => i + 1,
          ).map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>
      </label>
    </li>
  );
};

export default CartItem;
