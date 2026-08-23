import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

import { AppTheme } from "../types/theme";
import { lightTheme } from "../theme/light";
import { darkTheme } from "../theme/dark";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  theme: AppTheme;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "light",
  theme: lightTheme,

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");

      const mode: ThemeMode =
        savedTheme === "dark"
          ? "dark"
          : savedTheme === "light"
          ? "light"
          : Appearance.getColorScheme() === "dark"
          ? "dark"
          : "light";

      set({
        mode,
        theme: mode === "dark" ? darkTheme : lightTheme,
      });
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  },

  toggleTheme: async () => {
    try {
      const newMode: ThemeMode =
        get().mode === "light" ? "dark" : "light";

      await AsyncStorage.setItem("theme", newMode);

      set({
        mode: newMode,
        theme: newMode === "dark" ? darkTheme : lightTheme,
      });
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  },
}));