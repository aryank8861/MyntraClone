import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

import {
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../config/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // ================================
  // LOGIN / SIGN UP
  // ================================

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing Details",
        "Please enter your email and password."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      if (isLogin) {
        // Login to existing Firebase account
        const result =
          await signInWithEmailAndPassword(
            auth,
            cleanEmail,
            password
          );

        console.log(
          "✅ Email login successful"
        );

        console.log(
          "User:",
          result.user.uid
        );

        console.log(
          "Anonymous:",
          result.user.isAnonymous
        );
      } else {
        // If currently anonymous,
        // upgrade the guest account
        // to an email/password account.
        if (auth.currentUser?.isAnonymous) {
          const credential =
            EmailAuthProvider.credential(
              cleanEmail,
              password
            );

          const result =
            await linkWithCredential(
              auth.currentUser,
              credential
            );

          console.log(
            "✅ Guest account upgraded"
          );

          console.log(
            "User:",
            result.user.uid
          );
        } else {
          // Create completely new account
          const result =
            await createUserWithEmailAndPassword(
              auth,
              cleanEmail,
              password
            );

          console.log(
            "✅ New account created"
          );

          console.log(
            "User:",
            result.user.uid
          );
        }
      }

      // Give Firebase auth state listeners
      // time to update.
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      Alert.alert(
        "Success 🎉",
        isLogin
          ? "You are now logged in."
          : "Your account has been created.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "🔥 AUTH ERROR CODE:",
        error?.code
      );

      console.log(
        "🔥 AUTH ERROR MESSAGE:",
        error?.message
      );

      console.log(
        "🔥 FULL AUTH ERROR:",
        error
      );

      let message =
        "Something went wrong. Please try again.";

      if (
        error?.code ===
        "auth/email-already-in-use"
      ) {
        message =
          "This email is already registered. Please log in instead.";
      } else if (
        error?.code ===
        "auth/invalid-email"
      ) {
        message =
          "Please enter a valid email address.";
      } else if (
        error?.code ===
        "auth/invalid-credential"
      ) {
        message =
          "Incorrect email or password.";
      } else if (
        error?.code ===
        "auth/user-not-found"
      ) {
        message =
          "No account exists with this email.";
      } else if (
        error?.code ===
        "auth/wrong-password"
      ) {
        message =
          "Incorrect password.";
      } else if (
        error?.code ===
        "auth/weak-password"
      ) {
        message =
          "Password must be at least 6 characters.";
      } else if (
        error?.code ===
        "auth/credential-already-in-use"
      ) {
        message =
          "This email is already connected to another account. Please log in instead.";
      } else if (
        error?.code ===
        "auth/operation-not-allowed"
      ) {
        message =
          "Email/Password authentication is not enabled in Firebase.";
      } else if (
        error?.code ===
        "auth/network-request-failed"
      ) {
        message =
          "Network error. Please check your internet connection.";
      } else if (
        error?.code ===
        "auth/too-many-requests"
      ) {
        message =
          "Too many attempts. Please wait and try again.";
      } else if (
        error?.code ===
        "auth/user-disabled"
      ) {
        message =
          "This account has been disabled.";
      }

      Alert.alert(
        "Authentication Error",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // CONTINUE AS GUEST
  // ================================

  const continueAsGuest = async () => {
    if (loading) return;

    try {
      setLoading(true);

      console.log(
        "🟡 Guest login started"
      );

      let user = auth.currentUser;

      // If there is no user OR the current
      // user is a regular account, create
      // a fresh anonymous account.
      if (!user || !user.isAnonymous) {
        console.log(
          "🟡 Creating anonymous Firebase user..."
        );

        const result =
          await signInAnonymously(auth);

        user = result.user;
      }

      console.log(
        "✅ Guest Firebase UID:",
        user.uid
      );

      console.log(
        "✅ Anonymous:",
        user.isAnonymous
      );

      // Wait for Firebase's auth listener
      // to receive the anonymous user.
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      console.log(
        "➡️ Opening main application..."
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(
        "🔥 GUEST AUTH ERROR CODE:",
        error?.code
      );

      console.log(
        "🔥 GUEST AUTH ERROR MESSAGE:",
        error?.message
      );

      console.log(
        "🔥 FULL GUEST ERROR:",
        error
      );

      let message =
        "Unable to continue as guest.";

      if (
        error?.code ===
        "auth/operation-not-allowed"
      ) {
        message =
          "Anonymous authentication is not enabled in Firebase.";
      } else if (
        error?.code ===
        "auth/network-request-failed"
      ) {
        message =
          "Network error. Please check your internet connection.";
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert(
        "Guest Login Error",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SCREEN
  // ================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>

        <Text style={styles.logo}>
          MYNTRA
        </Text>

        <Text style={styles.title}>
          {isLogin
            ? "Welcome Back"
            : "Create Your Account"}
        </Text>

        <Text style={styles.subtitle}>
          {isLogin
            ? "Login to sync your account across devices."
            : "Create an account to keep your data synced."}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin
                ? "LOGIN"
                : "CREATE ACCOUNT"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setIsLogin(!isLogin)
          }
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={continueAsGuest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#555"
            />
          ) : (
            <Text style={styles.guestText}>
              Continue as Guest
            </Text>
          )}
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

// ================================
// STYLES
// ================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    textAlign: "center",
    fontSize: 38,
    fontWeight: "900",
    color: "#ff3f6c",
    marginBottom: 35,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 22,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#fafafa",
    color: "#111",
  },

  button: {
    height: 54,
    backgroundColor: "#ff3f6c",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  switchText: {
    textAlign: "center",
    color: "#ff3f6c",
    fontWeight: "600",
    marginTop: 22,
  },

  guestButton: {
    marginTop: 25,
    alignItems: "center",
    minHeight: 24,
    justifyContent: "center",
  },

  guestText: {
    color: "#555",
    fontWeight: "600",
  },
});