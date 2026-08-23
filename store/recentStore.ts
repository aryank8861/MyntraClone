import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  collection,
  doc,
  setDoc,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

type RecentItem = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  viewedAt?: number;
};

type RecentStore = {
  recent: RecentItem[];

  addRecent: (
    item: RecentItem
  ) => Promise<void>;

  loadRecent: () => Promise<void>;
};

// Wait until Firebase finishes restoring the auth session
const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    const unsubscribe =
      onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
  });
};

export const useRecentStore =
  create<RecentStore>((set, get) => ({
    recent: [],

    // ==========================================
    // LOAD RECENTLY VIEWED PRODUCTS
    // ==========================================
    loadRecent: async () => {
      try {
        // 1. Load local cache immediately
        const localData =
          await AsyncStorage.getItem(
            "recentProducts"
          );

        if (localData) {
          try {
            const parsedData =
              JSON.parse(localData);

            if (Array.isArray(parsedData)) {
              set({
                recent: parsedData,
              });
            }
          } catch (error) {
            console.log(
              "Error parsing local recent products:",
              error
            );
          }
        }

        // 2. Wait for Firebase authentication
        const user =
          await getCurrentUser();

        if (!user) {
          console.log(
            "No authenticated user. Using local recently viewed products."
          );
          return;
        }

        console.log(
          "Loading recently viewed for user:",
          user.uid
        );

        // 3. Load from Firestore
        const recentRef = collection(
          db,
          "users",
          user.uid,
          "recentlyViewed"
        );

        const snapshot =
          await getDocs(recentRef);

        if (!snapshot.empty) {
          const firebaseRecent =
            snapshot.docs
              .map(
                (document) =>
                  document.data() as RecentItem
              )
              .sort(
                (a, b) =>
                  (b.viewedAt || 0) -
                  (a.viewedAt || 0)
              )
              .slice(0, 20);

          // 4. Update UI
          set({
            recent: firebaseRecent,
          });

          // 5. Update local cache
          await AsyncStorage.setItem(
            "recentProducts",
            JSON.stringify(firebaseRecent)
          );

          console.log(
            "Recently viewed loaded from Firebase ✅"
          );
        } else {
          console.log(
            "No recently viewed products found in Firebase."
          );
        }
      } catch (error) {
        console.log(
          "Error loading recently viewed:",
          error
        );
      }
    },

    // ==========================================
    // ADD PRODUCT TO RECENTLY VIEWED
    // ==========================================
    addRecent: async (item) => {
      try {
        const currentRecent =
          get().recent;

        // Remove duplicate
        const filtered =
          currentRecent.filter(
            (i) => i.id !== item.id
          );

        // Newest product first
        const viewedAt =
          Date.now();

        const updated: RecentItem[] = [
          {
            ...item,
            viewedAt,
          },
          ...filtered,
        ].slice(0, 20);

        // 1. Update UI immediately
        set({
          recent: updated,
        });

        // 2. Save locally
        await AsyncStorage.setItem(
          "recentProducts",
          JSON.stringify(updated)
        );

        console.log(
          "Recently viewed saved locally ✅"
        );

        // 3. Wait for authenticated user
        const user =
          await getCurrentUser();

        if (!user) {
          console.log(
            "No authenticated user. Saved locally only."
          );
          return;
        }

        // 4. Save to Firebase
        const productRef = doc(
          db,
          "users",
          user.uid,
          "recentlyViewed",
          item.id.toString()
        );

        await setDoc(productRef, {
          ...item,
          viewedAt,
        });

        console.log(
          "Recently viewed synced to Firebase ✅"
        );
      } catch (error) {
        console.log(
          "Error saving recently viewed:",
          error
        );
      }
    },
  }));