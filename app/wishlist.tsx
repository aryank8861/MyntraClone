import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useWishlistStore } from "../store/wishlistStore";

export default function WishlistScreen() {
  const router = useRouter();

  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emoji}>❤️</Text>
        <Text style={styles.emptyTitle}>
          Your Wishlist is Empty
        </Text>
        <Text style={styles.emptyText}>
          Tap the heart on products to save them here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>

      {wishlist.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => router.push(`/product/${item.id}`)}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />

          <View style={styles.info}>
            <Text style={styles.brand}>
              {item.brand}
            </Text>

            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.price}>
              ₹{item.price}
            </Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() =>
                toggleWishlist(item)
              }
            >
              <Text style={styles.removeText}>
                Remove ❤️
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 10,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },

  brand: {
    color: "gray",
    fontSize: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },

  price: {
    color: "#ff3f6c",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },

  removeButton: {
    marginTop: 12,
  },

  removeText: {
    color: "#ff3f6c",
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },

  emoji: {
    fontSize: 70,
  },

  emptyTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
  },

  emptyText: {
    color: "gray",
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
});