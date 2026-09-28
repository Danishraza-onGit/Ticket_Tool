import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AppIcon, {
  AppIconName,
} from "../ui/AppIcon";

import { COLORS } from "../../constants/colors";

type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

type DrawerItemProps = {
  icon: AppIconName;
  label: string;
  onPress: () => void;
};

const DRAWER_WIDTH = Dimensions.get("window").width * 0.74;

export default function SideDrawer({
  visible,
  onClose,
}: SideDrawerProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /*const [mounted, setMounted] = useState(visible);*/

  const handleActivityLogPress = () => {
    onClose();
    router.push("/home/activity-log");
  };
  const [translateX] = useState(
    () => new Animated.Value(visible ? 0 : -DRAWER_WIDTH)
  );

  const [backdropOpacity] = useState(
    () => new Animated.Value(visible ? 1 : 0)
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -DRAWER_WIDTH,
        duration: visible ? 200 : 180,
        useNativeDriver: true,
      }),

      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 170 : 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateX, backdropOpacity]);

  const handleAnalyticsPress = () => {
    onClose();
    router.push("/home/analytics");
  };

  const handleRoutineCheckPress = () => {
    onClose();
    router.push("/home/routine-check");
  };

  const handleInwardOutwardPress = () => {
    onClose();
    router.push("/home/inward-outward");
  };

  const handlePendingRequestsPress = () => {
    onClose();
    router.push("/home/pending-requests");
  };


  const handleEmployeesPress = () => {
    onClose();
    router.push("/home/employees");
  };
  const handleCustomersPress = () => {
    onClose();
    router.push("/home/customers");
  };



  return (
    <View style={styles.overlay} pointerEvents={visible ? "box-none" : "none"}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + 20,
            paddingBottom: Math.max(insets.bottom, 20),
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>
              CYGNUS
            </Text>

            <Text style={styles.logoSubtitle}>
              TICKETING SYSTEM
            </Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={8}
          >
            <Ionicons
              name="close"
              size={25}
              color={COLORS.textSubtle}
            />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuList}>
          <DrawerItem
            icon="inwardOutward"
            label="Inwards/Outwards"
            onPress={handleInwardOutwardPress}
          />

          <DrawerItem
            icon="pendingRequests"
            label="Pending Requests"
            onPress={handlePendingRequestsPress}
          />

          <DrawerItem
            icon="activityLog"
            label="Activity Log"
            onPress={handleActivityLogPress}
          />

          <DrawerItem
            icon="customers"
            label="Customers"
            onPress={handleCustomersPress}
          />

          <DrawerItem
            icon="analytics"
            label="Analytics"
            onPress={handleAnalyticsPress}
          />

          <DrawerItem
            icon="routineCheck"
            label="Routine Check"
            onPress={handleRoutineCheckPress}
          />

          <DrawerItem
            icon="employees"
            label="Employees"
            onPress={handleEmployeesPress}
          />
        </View>
      </Animated.View>
    </View>
  );
}

function DrawerItem({
  icon,
  label,
  onPress,
}: DrawerItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.drawerItem,
        pressed && styles.drawerItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <AppIcon
          name={icon}
          size={20}
          color={COLORS.black}
        />
      </View>

      <Text style={styles.drawerItemLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.overlay,
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,

    backgroundColor: COLORS.white,


    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    paddingHorizontal: 22,
  },

  logoText: {
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: COLORS.brandBlue,
  },

  logoSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginTop: 2,
    letterSpacing: 0.2,
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    marginTop: -2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,

    marginHorizontal: 22,
    marginTop: 24,
    marginBottom: 14,
  },

  menuList: {
    paddingHorizontal: 14,
    paddingTop: 4,
  },

  drawerItem: {
    minHeight: 45,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    borderRadius: 10,
  },
  drawerItemPressed: {
    backgroundColor: COLORS.pressed,
  },

  iconContainer: {
    width: 40,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 5,
  },

  drawerItemLabel: {
    flex: 1,

    fontSize: 14,
    fontWeight: "500",

    color: COLORS.black,
  },
});