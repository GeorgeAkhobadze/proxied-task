import { useMutation } from '@apollo/client';
import { ADD_ITEM_MUTATION } from '@/graphql/mutations';
import { useCartAddItemSchema } from '@/validations/cartSchemas';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/graphql/types';

export const useProductCardActions = (product: Product) => {
  const { addToCart, cart } = useCart();
  const schema = useCartAddItemSchema();
  const { showToast } = useToast();
  const [addItem, { loading: addItemLoading }] = useMutation(ADD_ITEM_MUTATION);

  const isInCart = cart.items.some((item) => item.product._id === product._id);
  const isOutOfStock = product.availableQuantity === 0;

  const handleAddItem = async () => {
    const input = {
      productId: product._id,
      quantity: 1,
    };
    const validationResult = schema.safeParse(input);

    if (!validationResult.success) {
      const firstErrorMessage =
        validationResult.error.errors[0]?.message ||
        'Validation failed. Please check the input.';
      showToast(firstErrorMessage, 'error');
      return;
    }

    try {
      await addItem({ variables: { input } });
      addToCart(product);
      showToast(`${product.title} added to cart`, 'success');
    } catch {
      showToast('An unexpected error occurred', 'error');
    }
  };

  return {
    handleAddItem,
    addItemLoading,
    isInCart,
    isOutOfStock,
  };
};
