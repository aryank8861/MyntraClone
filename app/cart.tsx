import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useCartStore } from "../store/cartstore";
import { sendLocalNotification } from "../services/notificationService";

export default function CartScreen() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert(
        "Your Bag is Empty",
        "Add products before checking out."
      );
      return;
    }

    try {
      await sendLocalNotification(
        "Order Placed 🎉",
        `Your order worth ₹${total} has been placed successfully.`
      );

      Alert.alert(
        "Order Placed 🎉",
        `Your order of ₹${total} has been placed successfully!`,
        [
          {
            text: "Continue Shopping",
          },
        ]
      );
    } catch (error) {
      console.log(
        "Checkout notification error:",
        error
      );

      Alert.alert(
        "Order Placed",
        "Your order has been placed successfully."
      );
    }
  };

  if (cart.length === 0) {
    return (
      <View
        style={styles.emptyContainer}
      >
        <Text style={styles.empty}>
          🛒
        </Text>

        <Text style={styles.emptyTitle}>
          Your Bag is Empty
        </Text>

        <Text style={styles.emptySub}>
          Add products to continue
          shopping.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Shopping Bag
      </Text>

      {cart.map((item) => (
        <View
          key={item.id}
          style={styles.card}
        >
          <Image
            source={{
              uri: item.image,
            }}
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

            <View
              style={styles.quantityRow}
            >
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  decreaseQuantity(
                    item.id
                  )
                }
              >
                <Text
                  style={styles.qtyText}
                >
                  −
                </Text>
              </TouchableOpacity>

              <Text
                style={styles.quantity}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  increaseQuantity(
                    item.id
                  )
                }
              >
                <Text
                  style={styles.qtyText}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() =>
                removeFromCart(item.id)
              }
            >
              <Text
                style={styles.remove}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total
        </Text>

        <Text style={styles.totalPrice}>
          ₹{total}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.checkout}
        onPress={handleCheckout}
      >
        <Text
          style={styles.checkoutText}
        >
          Proceed to Checkout
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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },

  card: {
    flexDirection: "row",
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    padding: 12,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  brand: {
    color: "gray",
    fontSize: 15,
  },

  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 3,
  },

  price: {
    color: "#ff3f6c",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 8,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  quantity: {
    marginHorizontal: 18,
    fontSize: 18,
    fontWeight: "bold",
  },

  remove: {
    color: "red",
    marginTop: 15,
    fontWeight: "600",
  },

  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  totalText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  totalPrice: {
    fontSize: 24,
    color: "#ff3f6c",
    fontWeight: "bold",
  },

  checkout: {
    backgroundColor: "#ff3f6c",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  empty: {
    fontSize: 70,
  },

  emptyTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
  },

  emptySub: {
    marginTop: 10,
    color: "gray",
    textAlign: "center",
    fontSize: 16,
  },
});