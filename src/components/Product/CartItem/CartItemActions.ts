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

export const useCartItemActions = (product: Product, cartItemId: string) => {
  const { showToast } = useToast();
  const { removeFromCart, changeQuantity } = useCart();

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

  const handleQuantityChange = async (value: number) => {
    const input = { cartItemId, quantity: value };
    const validationResult = cartUpdateItemQuantitySchema.safeParse(input);

    if (!validationResult.success) {
      showToast(validationResult.error.errors[0].message, 'error');
      return;
    }
    try {
      changeQuantity(cartItemId, value);
      await updateItemQuantity({ variables: { input } });
      showToast('Quantity Updated Successfully', 'success');
    } catch {
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
