import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type AccountSummaryCardProps = {
  initials: string;
  displayName: string;
  email: string;
  role: string;
};

export default function AccountSummaryCard({
  initials,
  displayName,
  email,
  role,
}: AccountSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials}
          </Text>
        </View>

        <View style={styles.onlineDot} />
      </View>

      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text
            style={styles.displayName}
            numberOfLines={1}
          >
            {displayName}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {role}
            </Text>
          </View>
        </View>

        <Text
          style={styles.email}
          numberOfLines={1}
        >
          {email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#172238",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  onlineDot: {
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#16B978",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    right: -2,
    bottom: -1,
  },

  userInfo: {
    flex: 1,
    marginLeft: 14,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  displayName: {
    maxWidth: "65%",
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },

  roleBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BEDAFF",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  roleText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1769E0",
  },

  email: {
    marginTop: 4,
    fontSize: 11,
    color: "#2a2b2b",
  },
});