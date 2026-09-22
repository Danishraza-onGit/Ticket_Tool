import React, { useEffect, useRef, useState } from "react";
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

type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

type DrawerItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
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

  const [mounted, setMounted] = useState(visible);
  const handleActivityLogPress = () => {
    onClose();
    router.push("/home/activity-log");
  };
  const translateX = useRef<Animated.Value>(
    new Animated.Value(visible ? 0 : -DRAWER_WIDTH)
  ).current;

  const backdropOpacity = useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  ).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 170,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [
    visible,
    mounted,
    translateX,
    backdropOpacity,

  ]);

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

  if (!mounted) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
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
              Cygnus
            </Text>

            <Text style={styles.logoSubtitle}>
              Ticketing System
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
              color="#5D6F86"
            />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuList}>
          <DrawerItem
            icon="swap-horizontal-outline"
            label="Inwards/Outwards"
            onPress={handleInwardOutwardPress}
          />

          <DrawerItem
            icon="time-outline"
            label="Pending Requests"
            onPress={handlePendingRequestsPress}
          />

          <DrawerItem
            icon="list-outline"
            label="Activity Log"
            onPress={handleActivityLogPress}
          />

          <DrawerItem
            icon="people-outline"
            label="Customers"
            onPress={handleCustomersPress}
          />

          <DrawerItem
            icon="analytics-outline"
            label="Analytics"
            onPress={handleAnalyticsPress}
          />

          <DrawerItem
            icon="checkmark-circle-outline"
            label="Routine Check"
            onPress={handleRoutineCheckPress}
          />

          <DrawerItem
            icon="people-circle-outline"
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
        <Ionicons
          name={icon}
          size={20}
          color="#030303"
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
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
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
    color: "#1E5A96",
  },

  logoSubtitle: {
    fontSize: 15,
    color: "#71849A",
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
    backgroundColor: "#E5EAF0",

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
    backgroundColor: "#F3F6F9",
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

    color: "#000000",
  },
});