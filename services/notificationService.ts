import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ==========================================
// REGISTER FOR PUSH NOTIFICATIONS
// ==========================================

export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "default",
          importance:
            Notifications.AndroidImportance.MAX,
          vibrationPattern: [
            0,
            250,
            250,
            250,
          ],
          lightColor: "#FF3F6C",
        }
      );
    }

    const {
      status: existingStatus,
    } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log(
        "Notification permission not granted."
      );
      return null;
    }

    if (!Device.isDevice) {
      console.log(
        "Push notifications require a physical device."
      );
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas
        ?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log(
        "EAS Project ID not found."
      );
      return null;
    }

    const token =
      await Notifications.getExpoPushTokenAsync(
        {
          projectId,
        }
      );

    console.log(
      "Expo Push Token:",
      token.data
    );

    return token.data;
  } catch (error) {
    console.log(
      "Error registering for push notifications:",
      error
    );

    return null;
  }
}

// ==========================================
// SEND LOCAL NOTIFICATION
// ==========================================

export async function sendLocalNotification(
  title: string,
  body: string
) {
  try {
    await Notifications.scheduleNotificationAsync(
      {
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      }
    );
  } catch (error) {
    console.log(
      "Error sending local notification:",
      error
    );
  }
}

// ==========================================
// ADD TO BAG NOTIFICATION
// ==========================================

export async function notifyItemAdded(
  productName: string
) {
  try {
    await sendLocalNotification(
      "Added to Bag 🛍️",
      `${productName} has been added to your bag.`
    );
  } catch (error) {
    console.log(
      "Error sending item added notification:",
      error
    );
  }
}

// ==========================================
// WISHLIST NOTIFICATION
// ==========================================

export async function notifyWishlistAdded(
  productName: string
) {
  try {
    await sendLocalNotification(
      "Added to Wishlist ❤️",
      `${productName} has been added to your wishlist.`
    );
  } catch (error) {
    console.log(
      "Error sending wishlist notification:",
      error
    );
  }
}

// ==========================================
// PRODUCT VIEWED NOTIFICATION
// ==========================================

export async function notifyProductViewed(
  productName: string
) {
  try {
    await sendLocalNotification(
      "Product Viewed 👀",
      `You viewed ${productName}.`
    );
  } catch (error) {
    console.log(
      "Error sending product viewed notification:",
      error
    );
  }
}

// ==========================================
// SCHEDULE NOTIFICATION
// ==========================================

export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds: number
) {
  try {
    await Notifications.scheduleNotificationAsync(
      {
        content: {
          title,
          body,
          sound: true,
        },
        trigger: {
          type:
            Notifications
              .SchedulableTriggerInputTypes
              .TIME_INTERVAL,
          seconds,
          repeats: false,
        },
      }
    );
  } catch (error) {
    console.log(
      "Error scheduling notification:",
      error
    );
  }
}

// ==========================================
// CANCEL ALL NOTIFICATIONS
// ==========================================

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.log(
      "Error cancelling notifications:",
      error
    );
  }
}
