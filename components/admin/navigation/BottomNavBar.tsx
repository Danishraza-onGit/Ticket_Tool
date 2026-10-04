import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/colors";

import AppIcon, {
  AppIconName,
} from "../../ui/AppIcon";

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
  icon: AppIconName;
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
        icon="dashboard"
        label="Dashboard"
        route="dashboard"
        activeRoute={activeRoute}
        onPress={() => onNavigate("dashboard")}
      />

      <BottomNavItem
        icon="myTickets"
        label="My Tickets"
        route="my-tickets"
        activeRoute={activeRoute}
        onPress={() => onNavigate("my-tickets")}
      />

      <BottomNavItem
        icon="overdue"
        label="Overdue"
        route="overdue"
        activeRoute={activeRoute}
        onPress={() => onNavigate("overdue")}
        notification
      />

      <BottomNavItem
        icon="projects"
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
        color: COLORS.ripple,
        borderless: true,
      }}
    >
      <View style={styles.iconWrapper}>
        <AppIcon
          name={icon}
          size={23}
          color={
            active 
            ? COLORS.navigationActive : COLORS.textMuted}
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

    backgroundColor: COLORS.white,

    borderTopWidth: 1,
    borderTopColor: COLORS.bottomNavBorder,

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

    color: COLORS.black,

    marginTop: 1,

    textAlign: "center",
  },

  bottomLabelActive: {
    color:COLORS.navigationActive,
    fontWeight: "600",
  },

  bottomNotificationDot: {
    position: "absolute",

    right: -4,
    top: 0,

    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: COLORS.notification,
  },
});