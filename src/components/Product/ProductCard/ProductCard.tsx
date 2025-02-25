import React from 'react';
import { Product } from '@/graphql/types';
import { useProductCardActions } from './ProductCardActions';

interface ProductProps {
  product: Product;
}

const ProductCard = ({ product }: ProductProps) => {
  const { handleAddItem, addItemLoading, isInCart, isOutOfStock } =
    useProductCardActions(product);

  return (
    <li
      className={`border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 transition-transform transform ${
        isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
      }`}
    >
      <h2 className="text-lg font-semibold text-gray-200">{product.title}</h2>
      <p className="text-gray-400">
        Price: <span className="text-green-400 font-bold">${product.cost}</span>
      </p>
      <p className="text-gray-500">Stock: {product.availableQuantity}</p>
      {isInCart ? (
        <p className="mt-6 text-gray-400">In Cart</p>
      ) : isOutOfStock ? (
        <p className="mt-6 text-red-500 font-bold">Out of Stock</p>
      ) : (
        <button
          onClick={handleAddItem}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded w-full"
          disabled={addItemLoading}
        >
          {addItemLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}
    </li>
  );
};

export default ProductCard;
