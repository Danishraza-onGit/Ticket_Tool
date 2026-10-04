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

type EmployeeHeaderProps = {
  onProfilePress?: () => void;
};

export default function EmployeeHeader({
  onProfilePress,
}: EmployeeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/cygnus-logo-no_bkg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.headerRight}>
        <View
          style={styles.notificationContainer}
        >
          <Ionicons
            name="notifications-outline"
            size={21}
            color={COLORS.textSubtle}
          />
        </View>

        <TouchableOpacity
          style={styles.userBadge}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.userInitial}>
              EM
            </Text>
          </View>

          <Text style={styles.userRole}>
            Employee
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
    borderBottomColor:
      COLORS.borderSoft,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
  },

  logoContainer: {
    marginLeft: -15,
    width: 112,
    height: 42,

    alignItems: "flex-start",
    justifyContent: "center",
    transform:[{translateY: 2.5}],
  },

  logo: {
    width: 140,
    height: 300,
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

    backgroundColor:
      COLORS.avatarBackground,

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