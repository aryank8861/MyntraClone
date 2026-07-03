import React from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MYNTRA</Text>

        <View style={styles.icons}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.icon}>❤️</Text>
          <Text style={styles.icon}>🛍️</Text>
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        placeholder="Search for brands and products"
        style={styles.searchBar}
      />

      {/* Myntra Logo */}
      <Image
        source={require("../../assets/images/image.png")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ff3f6c",
  },

  icons: {
    flexDirection: "row",
  },

  icon: {
    fontSize: 24,
    marginLeft: 18,
  },

  searchBar: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 25,
  },

  image: {
    width: 180,
    height: 180,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 20,
  },
});