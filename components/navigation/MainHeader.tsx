import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MainHeaderProps = {
  onMenuPress: () => void;
  onProfilePress?: () => void;
};

export default function MainHeader({
  onMenuPress,
  onProfilePress,
}: MainHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Hamburger */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="menu-outline"
          size={27}
          color="#174F8A"
        />
      </TouchableOpacity>

      {/* CYGNUS branding */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          CYGNUS
        </Text>

        <Text style={styles.logoSubtitle}>
          TICKETING SYSTEM
        </Text>
      </View>

      {/* Right side */}
      <View style={styles.headerRight}>
        {/* Notification */}
        <View style={styles.notificationContainer}>
          <Ionicons
            name="notifications-outline"
            size={21}
            color="#5D6F86"
          />

          <View style={styles.notificationDot} />
        </View>

        {/* User */}
        <TouchableOpacity
          style={styles.userBadge}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.userInitial}>
              SH
            </Text>
          </View>

          <Text style={styles.userRole}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 62,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E7EF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  menuButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginLeft: 4,
  },

  logoText: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#174F8A",
  },

  logoSubtitle: {
    fontSize: 7,
    letterSpacing: 1,
    color: "#545456",
    marginTop: 1,
  },

  headerRight: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  notificationContainer: {
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    right: -1,
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F04A68",
  },

  userBadge: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    paddingLeft: 4,
    paddingRight: 10,
    gap: 6,
  },

  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#172238",
    alignItems: "center",
    justifyContent: "center",
  },

  userInitial: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  userRole: {
    fontSize: 9,
    fontWeight: "600",
    color: "#050505",
  },
});