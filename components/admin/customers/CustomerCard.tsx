import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Customer } from "../../../types/customer";
import { getInitials } from "../../../utils/getInitials";
import { COLORS } from "../../../constants/colors";

type Props = { customer: Customer; onCompanyPress: () => void };

export default function CustomerCard({ customer, onCompanyPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onCompanyPress} activeOpacity={0.8}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(customer.company)}</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.company} numberOfLines={1}>{customer.company}</Text>
        <Text style={styles.contactName} numberOfLines={1}>{customer.contactName}</Text>
        <Text style={styles.contactNo} numberOfLines={1}>{customer.contactNo}</Text>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.ticketSummary}>
          <Text style={styles.totalTickets}>
            {customer.totalTickets} {customer.totalTickets === 1 ? "tkt" : "tkts"}
          </Text>
          <Text style={styles.separator}>·</Text>
          <Text style={[styles.openTickets, customer.openTickets > 0 ? styles.openActive : styles.openClear]}>
            {customer.openTickets} open
          </Text>
        </View>
        <Text style={styles.lastActivity}>{customer.lastActivity}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88, backgroundColor: COLORS.white, borderRadius: 15,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14,
    paddingVertical: 13, flexDirection: "row", alignItems: "center", marginBottom: 10,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 13, backgroundColor: COLORS.avatarBackground,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 13, fontWeight: "700", color: COLORS.white },
  customerInfo: { flex: 1, minWidth: 0, marginLeft: 12, marginRight: 8 },
  company: { fontSize: 12, fontWeight: "700", color: COLORS.navigationActive },
  contactName: { marginTop: 4, fontSize: 10, color: COLORS.textPrimary },
  contactNo: { marginTop: 4, fontSize: 9.5, color: COLORS.textSecondary },
  rightSection: { alignItems: "flex-end", justifyContent: "center" },
  ticketSummary: {
    minHeight: 23, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.background, paddingHorizontal: 6,
    flexDirection: "row", alignItems: "center",
  },
  totalTickets: { fontSize: 8.5, fontWeight: "600", color: COLORS.navigationActive },
  separator: { marginHorizontal: 4, fontSize: 8.5, color: COLORS.textNeutral },
  openTickets: { fontSize: 8.5, fontWeight: "700" },
  openActive: { color: COLORS.danger },
  openClear: { color: COLORS.success },
  lastActivity: { marginTop: 7, fontSize: 8.5, color: COLORS.textNeutral },
});
