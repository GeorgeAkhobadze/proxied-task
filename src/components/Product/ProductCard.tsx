import React from 'react';
import { Product } from '@/graphql/types';
import { useMutation, useSubscription } from '@apollo/client';
import { ADD_ITEM_MUTATION } from '@/graphql/mutations';

interface ProductProps {
  product: Product;
}

const ProductCard = ({ product }: ProductProps) => {
  const [
    addItem,
    { data: addItemData, loading: addItemLoading, error: addItemError },
  ] = useMutation(ADD_ITEM_MUTATION);

  const handleAddItem = () => {
    addItem({
      variables: {
        input: {
          productId: product._id,
          quantity: 1,
        },
      },
    })
      .then((res) => {
        console.log('Item added:', res.data);
      })
      .catch((err) => {
        console.log('Error adding item:', err);
      });
  };

  return (
    <li className="border cursor-pointer border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 transition-transform transform hover:scale-105 hover:bg-gray-700">
      <h2 className="text-lg font-semibold text-gray-200">{product.title}</h2>
      <p className="text-gray-400">
        Price: <span className="text-green-400 font-bold">${product.cost}</span>
      </p>
      <p className="text-gray-500">Stock: {product.availableQuantity}</p>
      <button
        onClick={() => handleAddItem()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={addItemLoading}
      >
        {addItemLoading ? 'Adding...' : 'Add Item'}
      </button>
    </li>
  );
};

export default ProductCard;
