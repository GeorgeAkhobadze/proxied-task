import React, { useState } from 'react';
import { Product } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import {
  REMOVE_ITEM_MUTATION,
  UPDATE_ITEM_QUANTITY_MUTATION,
} from '@/graphql/mutations';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import {
  cartRemoveItemSchema,
  cartUpdateItemQuantitySchema,
} from '@/validations/cartSchemas';

interface ProductProps {
  product: Product;
  quantity: number;
  cartItemId: string | undefined;
}

const CartItem = ({ product, quantity, cartItemId }: ProductProps) => {
  const { showToast } = useToast();
  const { removeFromCart } = useCart();
  const [displayedQuantity, setDisplayedQuantity] = useState(quantity);
  const [updateItemQuantity, { loading: updateQuantityLoading }] = useMutation(
    UPDATE_ITEM_QUANTITY_MUTATION,
  );
  const [removeItem, { loading: removeItemLoading }] =
    useMutation(REMOVE_ITEM_MUTATION);

  const handleItemRemove = async () => {
    const validationResult = cartRemoveItemSchema.safeParse({ cartItemId });
    if (!validationResult.success) {
      showToast(validationResult.error.errors[0].message, 'error');
      return;
    }

    try {
      await removeItem({
        variables: {
          input: {
            cartItemId: cartItemId,
          },
        },
      });
      removeFromCart(product._id);
      showToast('Item Removed Successfully', 'success');
    } catch (err) {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleQuantityChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const input = {
      cartItemId: cartItemId,
      quantity: Number(e.target.value),
    };

    const validationResult = cartUpdateItemQuantitySchema.safeParse(input);
    if (!validationResult.success) {
      showToast(validationResult.error.errors[0].message, 'error');
      return;
    }
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
      className={`group border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 transition-transform transform hover:bg-gray-700 flex flex-col`}
    >
      <h2 className="text-lg font-semibold text-gray-200">{product.title}</h2>
      <p className="text-gray-400">
        Price: <span className="text-green-400 font-bold">${product.cost}</span>
      </p>
      <button
        className="absolute top-2 right-2 bg-red-500 rounded w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        onClick={() => handleItemRemove()}
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
