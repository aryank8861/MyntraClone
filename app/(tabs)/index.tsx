import { products } from "../../data/products";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, {
  useEffect,
  useState,
} from "react";
import { useRouter } from "expo-router";

import { useCartStore } from "../../store/cartstore";
import { useRecentStore } from "../../store/recentStore";
import { useTheme } from "../../context/ThemeContext";

const categories = [
  "Men",
  "Women",
  "Kids",
  "Beauty",
  "Home",
  "Footwear",
];

export default function HomeScreen() {
  const router = useRouter();

  // ==========================================
  // NEW SCALABLE THEME SYSTEM
  // ==========================================

  const {
    colors,
    isDark,
    toggleTheme,
  } = useTheme();

  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] =
    useState("");

  const filteredProducts =
    products.filter((item) =>
      `${item.brand} ${item.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // ==========================================
  // CART
  // ==========================================

  const cart = useCartStore(
    (state) => state.cart
  );

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  // ==========================================
  // RECENTLY VIEWED
  // ==========================================

  const recent = useRecentStore(
    (state) => state.recent
  );

  const loadRecent =
    useRecentStore(
      (state) => state.loadRecent
    );

  // ==========================================
  // LOAD RECENT PRODUCTS
  // ==========================================

  useEffect(() => {
    loadRecent();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        style={{
          backgroundColor:
            colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* =====================================
            HEADER
        ====================================== */}

        <View style={styles.header}>
          <Text
            style={[
              styles.logo,
              {
                color: colors.primary,
              },
            ]}
          >
            MYNTRA
          </Text>

          <View style={styles.icons}>

            {/* Theme Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
            >
              <Text style={styles.icon}>
                {isDark
                  ? "☀️"
                  : "🌙"}
              </Text>
            </TouchableOpacity>

            {/* Wishlist */}
            <TouchableOpacity
              onPress={() =>
                router.push(
                  "/wishlist"
                )
              }
            >
              <Text style={styles.icon}>
                ❤️
              </Text>
            </TouchableOpacity>

            {/* Cart */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() =>
                router.push("/cart")
              }
            >
              <Text style={styles.icon}>
                🛍️
              </Text>

              {totalItems > 0 && (
                <View
                  style={styles.badge}
                >
                  <Text
                    style={
                      styles.badgeText
                    }
                  >
                    {totalItems}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

          </View>
        </View>

        {/* =====================================
            SEARCH
        ====================================== */}

        <TextInput
          placeholder="Search for brands and products"
          placeholderTextColor={
            colors.secondaryText
          }
          style={[
            styles.search,
            {
              backgroundColor:
                colors.surface,
              color: colors.text,
              borderColor:
                colors.border,
            },
          ]}
          value={search}
          onChangeText={setSearch}
        />

        {/* =====================================
            SALE BANNER
        ====================================== */}

        <View
          style={[
            styles.banner,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={styles.bannerTitle}
          >
            END OF REASON SALE
          </Text>

          <Text
            style={styles.bannerSubtitle}
          >
            50% - 80% OFF
          </Text>
        </View>

        {/* =====================================
            RECENTLY VIEWED
        ====================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Recently Viewed
        </Text>

        {recent.length === 0 ? (
          <View
            style={styles.emptyRecent}
          >
            <Text
              style={[
                styles.emptyRecentText,
                {
                  color: colors.text,
                },
              ]}
            >
              No recently viewed
              products yet.
            </Text>

            <Text
              style={[
                styles.emptyRecentSubtext,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Open a product to see it
              here.
            </Text>
          </View>
        ) : (
          <View style={styles.products}>
            {recent.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push(
                    `/product/${item.id}`
                  )
                }
              >
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={[
                    styles.productImage,
                    {
                      backgroundColor:
                        colors.surface,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.brand,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {item.brand}
                </Text>

                <Text
                  style={[
                    styles.product,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.price,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ₹{item.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* =====================================
            CATEGORIES
        ====================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Shop By Category
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          {categories.map((item) => (
            <View
              key={item}
              style={styles.category}
            >
              <View
                style={[
                  styles.categoryCircle,
                  {
                    backgroundColor:
                      isDark
                        ? "#3A252D"
                        : "#FFE4EC",
                  },
                ]}
              />

              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* =====================================
            DEALS OF THE DAY
        ====================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Deals of the Day
        </Text>

        {search.length > 0 && (
          <Text
            style={[
              styles.productsFound,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {filteredProducts.length}{" "}
            Products Found
          </Text>
        )}

        <View style={styles.products}>
          {filteredProducts.map(
            (item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push(
                    `/product/${item.id}`
                  )
                }
              >
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={[
                    styles.productImage,
                    {
                      backgroundColor:
                        colors.surface,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.brand,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {item.brand}
                </Text>

                <Text
                  style={[
                    styles.product,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.price,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ₹{item.price}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginTop: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
  },

  icons: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
    marginLeft: 16,
  },

  cartButton: {
    marginLeft: 16,
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor:
      "#FF3F6C",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  search: {
    margin: 16,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },

  banner: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 24,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 24,
  },

  bannerSubtitle: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 18,
    marginHorizontal: 16,
  },

  emptyRecent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  emptyRecentText: {
    fontSize: 15,
    fontWeight: "600",
  },

  emptyRecentSubtext: {
    fontSize: 13,
    marginTop: 4,
  },

  productsFound: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontWeight: "600",
  },

  category: {
    alignItems: "center",
    marginRight: 18,
  },

  categoryCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  categoryText: {
    marginTop: 8,
    fontWeight: "600",
  },

  products: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  card: {
    width: "48%",
    marginBottom: 18,
  },

  productImage: {
    height: 200,
    borderRadius: 16,
  },

  brand: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 16,
  },

  product: {
    marginTop: 4,
  },

  price: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 18,
  },
});