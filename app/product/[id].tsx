import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { products } from "../../data/products";
import { useCartStore } from "../../store/cartstore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useRecentStore } from "../../store/recentStore";

import {
  notifyProductViewed,
  notifyItemAdded,
} from "../../services/notificationService";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();

  const [selectedSize, setSelectedSize] =
    useState("");

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const isWishlisted = useWishlistStore(
    (state) => state.isWishlisted
  );

  const addRecent = useRecentStore(
    (state) => state.addRecent
  );

  // Find product
  const product = products.find(
    (item) => item.id.toString() === id
  );

  const liked = product
    ? isWishlisted(product.id.toString())
    : false;

  // ==========================================
  // RECENTLY VIEWED
  // ==========================================
  useEffect(() => {
    if (!product) return;

    const saveRecentlyViewed = async () => {
      try {
        await addRecent({
          id: product.id.toString(),
          brand: product.brand,
          name: product.name,
          image: product.image,
          price: product.price,
        });

        console.log(
          "Recently viewed saved ✅"
        );

        // Event-driven notification
        await notifyProductViewed(
          product.name
        );
      } catch (error) {
        console.log(
          "Error saving recently viewed:",
          error
        );
      }
    };

    saveRecentlyViewed();
  }, [product?.id]);

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================
  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>
          Product not found
        </Text>
      </View>
    );
  }

  // ==========================================
  // ADD TO BAG
  // ==========================================
  const handleAddToBag = () => {
    if (!selectedSize) {
      Alert.alert(
        "Select Size",
        "Please select a size before adding to bag."
      );
      return;
    }

    addToCart({
      id: product.id,
      brand: product.brand,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });

    // Event-driven notification
    notifyItemAdded(product.name);

    Alert.alert(
      "Success",
      "Product added to bag 🛍️"
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={styles.image}
      />

      {/* Product Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>
            {product.brand}
          </Text>

          <Text style={styles.name}>
            {product.name}
          </Text>
        </View>

        {/* Wishlist */}
        <TouchableOpacity
          onPress={() =>
            toggleWishlist({
              id: product.id,
              brand: product.brand,
              name: product.name,
              image: product.image,
              price: product.price,
            })
          }
        >
          <Text style={styles.heart}>
            {liked ? "❤️" : "🤍"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rating */}
      <View style={styles.ratingBox}>
        <Text style={styles.ratingText}>
          ⭐ {product.rating}
        </Text>

        <Text style={styles.ratingCount}>
          {" | "}
          {product.reviews} Ratings
        </Text>
      </View>

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          ₹{product.price}
        </Text>

        <Text style={styles.originalPrice}>
          ₹{product.originalPrice}
        </Text>

        <Text style={styles.discount}>
          {product.discount}
        </Text>
      </View>

      {/* Size */}
      <Text style={styles.section}>
        Select Size
      </Text>

      <View style={styles.sizeRow}>
        {product.sizes.map(
          (size: string) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeCircle,
                selectedSize === size &&
                  styles.selectedSize,
              ]}
              onPress={() =>
                setSelectedSize(size)
              }
            >
              <Text
                style={
                  selectedSize === size
                    ? styles.selectedSizeText
                    : styles.sizeText
                }
              >
                {size}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Delivery */}
      <View style={styles.deliveryBox}>
        <Text style={styles.deliveryTitle}>
          🚚 Delivery by Tomorrow
        </Text>

        <Text style={styles.deliveryText}>
          Free delivery on orders above ₹799
        </Text>
      </View>

      {/* Product Details */}
      <Text style={styles.section}>
        Product Details
      </Text>

      <Text style={styles.description}>
        {product.description}
      </Text>

      {/* Add To Bag */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAddToBag}
      >
        <Text style={styles.buttonText}>
          ADD TO BAG
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  notFoundText: {
    fontSize: 18,
    color: "#555",
  },

  image: {
    width: "100%",
    height: 360,
    borderRadius: 16,
    resizeMode: "cover",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  heart: {
    fontSize: 32,
  },

  brand: {
    color: "gray",
    fontSize: 18,
  },

  name: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 6,
  },

  ratingBox: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
  },

  ratingText: {
    fontWeight: "bold",
  },

  ratingCount: {
    color: "#555",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  price: {
    fontSize: 30,
    color: "#ff3f6c",
    fontWeight: "bold",
  },

  originalPrice: {
    marginLeft: 12,
    color: "gray",
    textDecorationLine: "line-through",
  },

  discount: {
    marginLeft: 10,
    color: "green",
    fontWeight: "bold",
  },

  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 15,
  },

  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  sizeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 12,
  },

  selectedSize: {
    backgroundColor: "#ff3f6c",
    borderColor: "#ff3f6c",
  },

  sizeText: {
    color: "#111",
  },

  selectedSizeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  deliveryBox: {
    marginTop: 20,
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 12,
  },

  deliveryTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  deliveryText: {
    color: "gray",
    marginTop: 6,
  },

  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },

  button: {
    marginTop: 35,
    backgroundColor: "#ff3f6c",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});