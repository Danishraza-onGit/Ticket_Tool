import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Customer } from "../../../types/customer";
import { COLORS } from "@/constants/colors";

type CustomerCardProps = {
  customer: Customer;
  onCompanyPress: () => void;
};

function getInitials(company: string) {
  const words = company
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "--";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0][0] + words[1][0]
  ).toUpperCase();
}

export default function CustomerCard({
  customer,
  onCompanyPress,
}: CustomerCardProps) {
  const hasOpenTickets =
    customer.openTickets > 0;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getInitials(customer.company)}
        </Text>
      </View>

      <View style={styles.customerInfo}>
        <TouchableOpacity
          onPress={onCompanyPress}
          activeOpacity={0.65}
          style={styles.companyButton}
        >
          <Text
            style={styles.company}
            numberOfLines={1}
            ellipsizeMode="tail"
            selectable
          >
            {customer.company}
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.contactName}
          numberOfLines={1}
          ellipsizeMode="tail"
          selectable
        >
          {customer.contactName}
        </Text>

        <Text
          style={styles.contactNo}
          numberOfLines={1}
          selectable
        >
          {customer.contactNo}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.ticketSummary}>
          <Text style={styles.totalTickets}>
            {customer.totalTickets}{" "}
            {customer.totalTickets === 1
              ? "tkt"
              : "tkts"}
          </Text>

          <Text style={styles.separator}>
            ·
          </Text>

          <Text
            style={[
              styles.openTickets,
              hasOpenTickets
                ? styles.openTicketsActive
                : styles.openTicketsClear,
            ]}
          >
            {customer.openTickets} open
          </Text>
        </View>

        <Text style={styles.lastActivity}>
          {customer.lastActivity}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    backgroundColor: COLORS.white,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 12,
    paddingVertical: 11,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 9,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 9,

    backgroundColor: COLORS.background,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.iconGrey,
  },

  customerInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    marginRight: 8,
  },

  companyButton: {
    maxWidth: "100%",
    alignSelf: "flex-start",
  },

  company: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },

  contactName: {
    marginTop: 3,
    fontSize: 9.5,
    color: COLORS.navigationActive,
  },

  contactNo: {
    marginTop: 3,
    fontSize: 9,
    color: COLORS.textSecondary,
  },

  rightSection: {
    width: 92,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  ticketSummary: {
    minHeight: 23,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  totalTickets: {
    fontSize: 8.5,
    fontWeight: "600",
    color: COLORS.navigationActive,
  },

  separator: {
    marginHorizontal: 4,
    fontSize: 8.5,
    color: COLORS.divider,
  },

  openTickets: {
    fontSize: 8.5,
    fontWeight: "700",
  },

  openTicketsActive: {
    color: COLORS.danger,
  },

  openTicketsClear: {
    color: COLORS.success,
  },

  lastActivity: {
    marginTop: 7,
    fontSize: 8.5,
    color: COLORS.textNeutral,
  },
});