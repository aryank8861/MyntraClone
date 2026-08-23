import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useColorScheme,
  ColorSchemeName,
} from "react-native";

type ThemeMode = "light" | "dark" | "system";

type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  primary: string;
  white: string;
  black: string;
};

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const lightColors: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F8F8F8",
  card: "#FFFFFF",
  text: "#111111",
  secondaryText: "#777777",
  border: "#DDDDDD",
  primary: "#FF3F6C",
  white: "#FFFFFF",
  black: "#000000",
};

const darkColors: ThemeColors = {
  background: "#121212",
  surface: "#1E1E1E",
  card: "#242424",
  text: "#FFFFFF",
  secondaryText: "#AAAAAA",
  border: "#383838",
  primary: "#FF3F6C",
  white: "#FFFFFF",
  black: "#000000",
};

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemTheme =
    useColorScheme();

  const [theme, setThemeState] =
    useState<ThemeMode>("system");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme =
        await AsyncStorage.getItem(
          "appTheme"
        );

      if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
      ) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.log(
        "Error loading theme:",
        error
      );
    }
  };

  const setTheme = async (
    newTheme: ThemeMode
  ) => {
    try {
      setThemeState(newTheme);

      await AsyncStorage.setItem(
        "appTheme",
        newTheme
      );
    } catch (error) {
      console.log(
        "Error saving theme:",
        error
      );
    }
  };

  const toggleTheme = async () => {
    const newTheme =
      isDark ? "light" : "dark";

    await setTheme(newTheme);
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      systemTheme === "dark");

  const colors = isDark
    ? darkColors
    : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        colors,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}