import { create } from "zustand";

type CartItem = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartStore = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);

      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        cart: [...state.cart, item],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),

  increaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: Math.max(1, i.quantity - 1),
            }
          : i
      ),
    })),
}));