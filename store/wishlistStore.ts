import { create } from "zustand";
import { notifyWishlistAdded } from "../services/notificationService";

type WishlistItem = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
};

type WishlistStore = {
  wishlist: WishlistItem[];

  toggleWishlist: (item: WishlistItem) => void;

  isWishlisted: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>(
  (set, get) => ({
    wishlist: [],

    toggleWishlist: (item) => {
      const exists = get().wishlist.find(
        (i) => i.id === item.id
      );

      if (exists) {
        // Remove from wishlist
        set({
          wishlist: get().wishlist.filter(
            (i) => i.id !== item.id
          ),
        });

        console.log(
          "💔 Removed from wishlist:",
          item.name
        );
      } else {
        // Add to wishlist
        set({
          wishlist: [
            ...get().wishlist,
            item,
          ],
        });

        console.log(
          "❤️ Added to wishlist:",
          item.name
        );

        // Send notification
        notifyWishlistAdded(item.name);
      }
    },

    isWishlisted: (id) =>
      get().wishlist.some(
        (i) => i.id === id
      ),
  })
);