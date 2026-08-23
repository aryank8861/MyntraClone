import { Tabs, router } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { View, ActivityIndicator } from "react-native";

export default function TabsLayout() {
  const [checking, setChecking] =
    useState(true);

  const [user, setUser] =
    useState(auth.currentUser);

  useEffect(() => {
    // Check existing Firebase session immediately
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setChecking(false);
    }

    // Listen for authentication changes
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          console.log(
            "🔐 Auth state:",
            currentUser
              ? currentUser.uid
              : "NO USER"
          );

          setUser(currentUser);
          setChecking(false);
        }
      );

    return unsubscribe;
  }, []);

  // Wait for Firebase to determine auth state
  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#ff3f6c"
        />
      </View>
    );
  }

  // No user → go back to login
  if (!user) {
    router.replace("/login");
    return null;
  }

  // Regular users AND anonymous users
  // are allowed to access the app.
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          display: "none",
        },
      }}
    />
  );
}