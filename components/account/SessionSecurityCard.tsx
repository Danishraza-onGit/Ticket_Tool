import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
            color="#103A76"
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
            color="#60748D"
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
            color="#9AAABC"
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
            color="#FF4141"
          />
        </View>

        <Text style={styles.logoutText}>
          Log out
        </Text>

        <Ionicons
          name="chevron-forward"
          size={15}
          color="#FF7070"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE4ED",
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
    fontSize: 11,
    fontWeight: "700",
    color: "#070707",
  },

  versionBadge: {
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  versionText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#9AABBD",
  },

  divider: {
    height: 1,
    backgroundColor: "#E9EEF4",
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
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 11,
    fontWeight: "600",
    color: "#000000",
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusBadge: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#059669",
  },

  disabledBadge: {
    backgroundColor: "#F1F5F9",
    borderColor: "#DCE4ED",
  },

  disabledText: {
    color: "#71849A",
  },

  logoutIconCircle: {
    backgroundColor: "#FFF1F1",
  },

  logoutText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 11,
    fontWeight: "600",
    color: "#E92929",
  },
});