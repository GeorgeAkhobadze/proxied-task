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
import { Product } from '@/graphql/types';

export const useCartItemActions = (
  product: Product,
  cartItemId: string | undefined,
  setDisplayedQuantity: React.Dispatch<React.SetStateAction<number>>,
  quantity: number,
) => {
  const { showToast } = useToast();
  const { removeFromCart } = useCart();

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
      await removeItem({ variables: { input: { cartItemId } } });
      removeFromCart(product._id);
      showToast('Item Removed Successfully', 'success');
    } catch {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleQuantityChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const input = { cartItemId, quantity: Number(e.target.value) };
    const validationResult = cartUpdateItemQuantitySchema.safeParse(input);

    if (!validationResult.success) {
      showToast(validationResult.error.errors[0].message, 'error');
      return;
    }

    try {
      setDisplayedQuantity(Number(e.target.value));
      await updateItemQuantity({ variables: { input } });
      showToast('Quantity Updated Successfully', 'success');
    } catch {
      setDisplayedQuantity(quantity);
      showToast('An unexpected error occurred', 'error');
    }
  };

  return {
    handleItemRemove,
    handleQuantityChange,
    updateQuantityLoading,
    removeItemLoading,
  };
};
