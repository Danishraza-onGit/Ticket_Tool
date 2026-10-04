import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

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
          color={COLORS.navigationActive}
        />
      </TouchableOpacity>

      {/* CYGNUS branding */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/cygnus-logo-no_bkg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right side */}
      <View style={styles.headerRight}>
        {/* Notification */}
        <View style={styles.notificationContainer}>
          <Ionicons
            name="notifications-outline"
            size={21}
            color={COLORS.textSubtle}
          />

          <View /*style={styles.notificationDot}*/ />
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
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

  // logoContainer: {
  //   marginLeft: 4,
  // },

  // logoText: {
  //   fontSize: 19,
  //   fontWeight: "800",
  //   letterSpacing: 1.2,
  //   color: COLORS.navigationActive,
  // },

  // logoSubtitle: {
  //   fontSize: 7,
  //   letterSpacing: 1,
  //   color: COLORS.textSubtle,
  //   marginTop: 1,
  // },

  logoContainer: {
  marginLeft: -10,

  width: 112,
  height: 42,

  alignItems: "flex-start",
  justifyContent: "center",
  transform: [{ translateY: 2.5 }],
},

logo: {
  width: 140,
  height: 400,
  resizeMode: "center",
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
    backgroundColor: COLORS.notification,
  },

  userBadge: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: 4,
    paddingRight: 10,
    gap: 6,
  },

  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.avatarBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  userInitial: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.white,
  },

  userRole: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.iconBlack,
  },
});