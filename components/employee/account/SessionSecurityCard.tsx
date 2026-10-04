import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type SessionSecurityCardProps = {
  onLogoutPress: () => void;
};

export default function SessionSecurityCard({
  onLogoutPress,
}: SessionSecurityCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons
            name="shield-checkmark"
            size={14}
            color={
              COLORS.iconBlack
            }
          />

          <Text
            style={styles.headerText}
          >
            Session & Security
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.row}
        onPress={onLogoutPress}
        activeOpacity={0.7}
      >
        <View
          style={
            styles.logoutIconCircle
          }
        >
          <Ionicons
            name="log-out-outline"
            size={16}
            color={COLORS.danger}
          />
        </View>

        <Text
          style={styles.logoutText}
        >
          Log out
        </Text>

        <Ionicons
          name="chevron-forward"
          size={15}
          color={COLORS.danger}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginBottom: 20,

    backgroundColor:
      COLORS.white,

    borderRadius: 18,

    borderWidth: 1,
    borderColor:
      COLORS.border,

    overflow: "hidden",
  },

  header: {
    minHeight: 49,

    paddingHorizontal: 20,

    justifyContent: "center",
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",

    gap: 7,
  },

  headerText: {
    fontSize: 11,
    fontWeight: "700",

    color:
      COLORS.textPrimary,
  },

  divider: {
    height: 1,

    backgroundColor:
      COLORS.divider,
  },

  row: {
    minHeight: 60,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
  },

  logoutIconCircle: {
    width: 32,
    height: 32,

    borderRadius: 10,

    backgroundColor:
      COLORS.statusOverdueBackground,

    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    flex: 1,

    marginLeft: 12,

    fontSize: 11,
    fontWeight: "600",

    color: COLORS.danger,
  },
});