import { z } from 'zod';
import validator from 'validator';
import { useCart } from '@/context/CartContext';

export function useCartAddItemSchema() {
  // Overwritten the provided validation to check if item already exists in cart just in case.
  const { cart } = useCart();

  return z.object({
    productId: z
      .string()
      .refine((input) => validator.isMongoId(input), 'Invalid product ID')
      .refine(
        (input) =>
          !cart.items.some((item) => item.product._id.toString() === input),
        'Product already in cart',
      ),
    quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }),
  });
}

export const cartRemoveItemSchema = z.object({
  cartItemId: z
    .string()
    .refine((input) => validator.isMongoId(input), 'Invalid cart item ID'),
});

export const cartUpdateItemQuantitySchema = z.object({
  cartItemId: z
    .string()
    .refine((input) => validator.isMongoId(input), 'Invalid cart item ID'),
  quantity: z.number().min(1),
});
