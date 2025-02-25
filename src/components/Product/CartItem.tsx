import React, { useEffect, useState } from 'react';
import { Product } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { UPDATE_ITEM_QUANTITY_MUTATION } from '@/graphql/mutations';
import { useToast } from '@/context/ToastContext';

interface ProductProps {
  product: Product;
  quantity: number;
  cartItemId: string;
}

const CartItem = ({ product, quantity, cartItemId }: ProductProps) => {
  const { showToast } = useToast();
  const [displayedQuantity, setDisplayedQuantity] = useState(quantity);
  const [updateItemQuantity, { loading: updateQuantityLoading }] = useMutation(
    UPDATE_ITEM_QUANTITY_MUTATION,
  );
  console.log('Cart product:', product);
  const handleQuantityChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const input = {
      cartItemId: cartItemId,
      quantity: Number(e.target.value),
    };

    try {
      setDisplayedQuantity(Number(e.target.value));
      await updateItemQuantity({ variables: { input } });
      showToast('Quantity Updated Successfully', 'success');
    } catch (error) {
      setDisplayedQuantity(quantity);
      showToast('An unexpected error occurred', 'error');
    }
  };

  return (
    <li
      className={`border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 transition-transform transform hover:bg-gray-700 flex flex-col`}
    >
      <h2 className="text-lg font-semibold text-gray-200">{product.title}</h2>
      <p className="text-gray-400">
        Price: <span className="text-green-400 font-bold">${product.cost}</span>
      </p>

      <p className="text-gray-500">Stock: {product.availableQuantity}</p>
      <label className="text-gray-300 flex mt-auto items-center justify-between">
        Quantity:
        <select
          disabled={updateQuantityLoading}
          className="self-end p-2 bg-gray-900 text-gray-200 rounded px-4"
          value={displayedQuantity}
          onChange={(e) => handleQuantityChange(e)}
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
