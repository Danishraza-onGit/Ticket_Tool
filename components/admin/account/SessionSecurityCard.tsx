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
  notificationsEnabled: boolean;
  onNotificationsPress: () => void;
  onLogoutPress: () => void;
};

export default function SessionSecurityCard({
  notificationsEnabled,
  onNotificationsPress,
  onLogoutPress,
}: SessionSecurityCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons
            name="shield-checkmark"
            size={14}
            color={COLORS.iconBlack}
          />

          <Text style={styles.headerText}>
            Session & Security
          </Text>
        </View>

        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>
            v2.4.1
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Notifications */}
      <TouchableOpacity
        style={styles.row}
        onPress={onNotificationsPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconCircle}>
          <Ionicons
            name="notifications-outline"
            size={16}
            color={COLORS.iconBlack}
          />
        </View>

        <Text style={styles.rowText}>
          Push Notifications
        </Text>

        <View style={styles.rowRight}>
          <View
            style={[
              styles.statusBadge,
              !notificationsEnabled &&
                styles.disabledBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                !notificationsEnabled &&
                  styles.disabledText,
              ]}
            >
              {notificationsEnabled
                ? "Enabled"
                : "Disabled"}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={15}
            color={COLORS.iconBlack}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Logout */}
      <TouchableOpacity
        style={styles.row}
        onPress={onLogoutPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconCircle,
            styles.logoutIconCircle,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={16}
            color={COLORS.danger}
          />
        </View>

        <Text style={styles.logoutText}>
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
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  header: {
    minHeight: 49,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  headerText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.black,
  },

  versionBadge: {
    borderRadius: 6,
    backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  versionText: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.textNeutral,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },

  row: {
    minHeight: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.searchButtonBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.black,
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusBadge: {
    backgroundColor: COLORS.statusClosedBackground,
    borderWidth: 1,
    borderColor: COLORS.closedBorder,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.statusClosedText,
  },

  disabledBadge: {
    backgroundColor: COLORS.searchButtonBackground,
    borderColor: COLORS.border,
  },

  disabledText: {
    color: COLORS.textMuted,
  },

  logoutIconCircle: {
    backgroundColor: COLORS.statusOverdueBackground,
  },

  logoutText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.danger,
  },
});