import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type BottomNavRoute =
  | "dashboard"
  | "my-tickets"
  | "overdue"
  | "projects";

type BottomNavBarProps = {
  activeRoute: BottomNavRoute;
  onNavigate: (route: BottomNavRoute) => void;
};

type BottomNavItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: BottomNavRoute;
  activeRoute: BottomNavRoute;
  onPress: () => void;
  notification?: boolean;
};

export default function BottomNavBar({
  activeRoute,
  onNavigate,
}: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomNavigation,
        {
          paddingBottom:
            Platform.OS === "ios"
              ? Math.max(insets.bottom, 6)
              : 8,
        },
      ]}
    >
      <BottomNavItem
        icon="home"
        label="Dashboard"
        route="dashboard"
        activeRoute={activeRoute}
        onPress={() => onNavigate("dashboard")}
      />

      <BottomNavItem
        icon="ticket-outline"
        label="My Tickets"
        route="my-tickets"
        activeRoute={activeRoute}
        onPress={() => onNavigate("my-tickets")}
      />

      <BottomNavItem
        icon="warning-outline"
        label="Overdue"
        route="overdue"
        activeRoute={activeRoute}
        onPress={() => onNavigate("overdue")}
        notification
      />

      <BottomNavItem
        icon="business-outline"
        label="Projects"
        route="projects"
        activeRoute={activeRoute}
        onPress={() => onNavigate("projects")}
      />
    </View>
  );
}

function BottomNavItem({
  icon,
  label,
  route,
  activeRoute,
  onPress,
  notification = false,
}: BottomNavItemProps) {
  const active = route === activeRoute;

  return (
    <Pressable
      style={styles.bottomItem}
      onPress={onPress}
      android_ripple={{
        color: "#E9EFF5",
        borderless: true,
      }}
    >
      <View style={styles.iconWrapper}>
        <Ionicons
          name={icon}
          size={23}
          color={active ? "#174F8A" : "#71849A"}
        />

        {notification && (
          <View style={styles.bottomNotificationDot} />
        )}
      </View>

      <Text
        style={[
          styles.bottomLabel,
          active && styles.bottomLabelActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#DDE5EE",

    flexDirection: "row",
    justifyContent: "space-around",

    paddingTop: 5,
  },

  bottomItem: {
    flex: 1,

    height: 45,

    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    height: 25,

    alignItems: "center",
    justifyContent: "center",
  },

  bottomLabel: {
    fontSize: 10,
    lineHeight: 15,

    color: "#000000",

    marginTop: 1,

    textAlign: "center",
  },

  bottomLabelActive: {
    color: "#174F8A",
    fontWeight: "600",
  },

  bottomNotificationDot: {
    position: "absolute",

    right: -4,
    top: 0,

    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: "#F04A68",
  },
});