import React, { useState } from 'react';
import { Product } from '@/graphql/types';
import { useProductCardActions } from './ProductCardActions';

interface ProductProps {
  product: Product;
}

const ProductCard = ({ product }: ProductProps) => {
  const { handleAddItem, addItemLoading, isInCart, isOutOfStock } =
    useProductCardActions(product);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <li
      className={`border flex flex-col border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 transition-transform transform ${
        isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
      }`}
    >
      <h2 className="text-lg font-semibold text-gray-200">{product.title}</h2>
      <p className="text-gray-400">
        Price: <span className="text-green-400 font-bold">${product.cost}</span>
      </p>
      <p className="text-gray-500">Stock: {product.availableQuantity}</p>
      {isInCart ? (
        <div className="pointer-events-none flex gap-2 mt-auto opacity-50">
          <p className="pointer-events-none px-4 py-2 text-orange-600 border-orange-600 border-2 transition-colors text-center rounded w-full">
            Product Already In Cart{' '}
          </p>
          <select className="min-w-[61px] h-[40px] self-end p-2 bg-gray-900 text-gray-200 rounded px-4">
            <option></option>
          </select>
        </div>
      ) : isOutOfStock ? (
        <p className="mt-6 text-red-500 font-bold">Out of Stock</p>
      ) : (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => handleAddItem(quantity)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded w-full"
            disabled={addItemLoading}
          >
            {addItemLoading ? 'Adding...' : 'Add to Cart'}
          </button>

          <select
            className="h-[40px] self-end p-2 bg-gray-900 text-gray-200 rounded px-4"
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[...Array(product.availableQuantity)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}
    </li>
  );
};

export default ProductCard;
