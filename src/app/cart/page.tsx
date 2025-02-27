'use client';
import { useCart } from '@/context/CartContext';
import React, { useEffect, useState } from 'react';
import CartItem from '@/components/Product/CartItem/CartItem';
import { useToast } from '@/context/ToastContext';
import UpdatedItemsModal from '@/components/UpdatedItemsModal/UpdatedItemsModal';
import { useQuery } from '@apollo/client';
import { GET_CART_HASH, GET_CART } from '@/graphql/queries';

export default function CartPage() {
  const { cart, setCart, updatedItems, clearUpdates } = useCart();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: hashData } = useQuery(GET_CART_HASH, {
    fetchPolicy: 'no-cache',
  });

  const { data: cartData } = useQuery(GET_CART, {
    skip: !hashData || hashData?.getCart.hash === cart.hash,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (cartData) {
      setCart({
        hash: cartData.getCart.hash,
        items: cartData.getCart.items,
      });
    }
  }, [hashData, cart.hash, cartData]);

  const handleCheckout = () => {
    showToast('Checked out!', 'success');
  };

  const checkUpdates = () => {
    if (updatedItems.length > 0) {
      setIsModalOpen(true);
    } else {
      handleCheckout();
    }
  };

  const handleConfirm = () => {
    clearUpdates();
    handleCheckout();
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cart.items?.map((item) => (
          <CartItem
            product={item.product}
            quantity={item.quantity}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            cartItemId={item._id}
            key={item.product._id}
          />
        ))}
      </ul>
      <div className="fixed bottom-0 left-0 w-full gap-4 flex items-center justify-end py-2 px-8 bg-gray-900">
        {updatedItems.length > 0 && (
          <p className="text-red-500">Warning: Some items have been changed</p>
        )}
        <button
          onClick={checkUpdates}
          className="bg-blue-600 py-2 px-4 rounded-md"
        >
          Checkout
        </button>
      </div>

      {isModalOpen && (
        <UpdatedItemsModal
          handleConfirm={handleConfirm}
          handleClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
