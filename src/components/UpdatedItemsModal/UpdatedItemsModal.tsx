import React from 'react';
import { useCart } from '@/context/CartContext';

interface UpdatedItemsModalProps {
  handleConfirm: () => void;
  handleClose: () => void;
}

const UpdatedItemsModal: React.FC<UpdatedItemsModalProps> = ({
  handleConfirm,
  handleClose,
}) => {
  const { updatedItems } = useCart();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-md">
        <h2 className="text-lg font-semibold">Updated Items</h2>
        <div className="flex flex-col gap-2 my-2">
          {updatedItems.map((item, i) => {
            return (
              <div key={item._id + `_${i}`} className="text-gray-300">
                {item.action === 'ITEM_OUT_OF_STOCK' ? (
                  <div className="text-gray-300 flex items-start justify-start gap-2">
                    <div className="text-red-500">DELETED:</div>
                    <div className="inline-flex items-center whitespace-nowrap">
                      {item.product.title}
                    </div>
                    <div>→</div>
                    <div className="line-through text-gray-500 whitespace-nowrap">
                      {item.product.title}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300 flex items-start justify-start gap-2">
                    <div className="text-green-500">UPDATED:</div>
                    <div className="inline-flex items-center whitespace-nowrap">
                      {item.product.title}:
                    </div>
                    <div>→</div>
                    <div className="text-gray-500 whitespace-nowrap">
                      <span className="line-through text-gray-500">
                        {item.quantity}
                      </span>
                      <span className="ml-2 mr-1">→</span>
                      <span className="text-green-500">
                        {item?.updatedQuantity}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Confirm
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-600 text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatedItemsModal;
