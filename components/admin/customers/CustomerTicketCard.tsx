import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CustomerTicket } from "../../../types/customer";
import { COLORS } from "../../../constants/colors";

type Props = { ticket: CustomerTicket; onTicketPress: () => void };

function statusColors(status: string) {
  switch (status) {
    case "Pending":
      return { backgroundColor: COLORS.statusPendingBackground, color: COLORS.statusPendingText };
    case "In Progress":
      return { backgroundColor: COLORS.statusInProgressBackground, color: COLORS.statusInProgressText };
    case "Overdue":
      return { backgroundColor: COLORS.statusOverdueBackground, color: COLORS.statusOverdueText };
    case "Closed":
      return { backgroundColor: COLORS.statusClosedBackground, color: COLORS.statusClosedText };
    default:
      return { backgroundColor: COLORS.searchButtonBackground, color: COLORS.textNeutral };
  }
}

export default function CustomerTicketCard({ ticket, onTicketPress }: Props) {
  const statusStyle = statusColors(ticket.status);
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onTicketPress} activeOpacity={0.7} style={styles.ticketNumberContainer}>
          <Text style={styles.ticketNumber}>#{ticket.ticketNo}</Text>
        </TouchableOpacity>
        <Text style={styles.date}>{ticket.date}</Text>
      </View>
      <View style={styles.mainRow}>
        <View style={styles.problemContainer}>
          <Text style={styles.problem} numberOfLines={2}>{ticket.problem}</Text>
          <Text style={styles.callType} numberOfLines={1}>{ticket.callType}</Text>
        </View>
        <View style={styles.badges}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>{ticket.priority}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{ticket.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.assignmentRow}>
        <View style={styles.assignmentColumn}>
          <Text style={styles.label}>ASSIGNED TO</Text>
          <Text style={styles.assignmentValue} numberOfLines={2}>{ticket.assignedTo || "—"}</Text>
        </View>
        <View style={[styles.assignmentColumn, styles.deadlineColumn]}>
          <Text style={styles.label}>DEADLINE</Text>
          <Text style={styles.assignmentValue}>{ticket.deadline || "—"}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onTicketPress} style={styles.detailsButton} activeOpacity={0.7}>
        <Text style={styles.detailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={15} color={COLORS.navigationActive} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ticketNumberContainer: { backgroundColor: COLORS.ticketNumberBackground, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  ticketNumber: { fontSize: 11, fontWeight: "700", color: COLORS.textDark },
  date: { fontSize: 10, color: COLORS.textNeutral },
  mainRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  problemContainer: { flex: 1, paddingRight: 8 },
  problem: { fontSize: 13, fontWeight: "600", color: COLORS.textDark, lineHeight: 19 },
  callType: { fontSize: 11, color: COLORS.textNeutral, marginTop: 3 },
  badges: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 5, maxWidth: "48%" },
  priorityBadge: { backgroundColor: COLORS.priorityP3Background, borderWidth: 1, borderColor: COLORS.priorityP3Border, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3 },
  priorityText: { fontSize: 10, fontWeight: "700", color: COLORS.priorityP3Text },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: "600" },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 10 },
  assignmentRow: { flexDirection: "row" },
  assignmentColumn: { flex: 1 },
  deadlineColumn: { alignItems: "flex-end" },
  label: { fontSize: 9, fontWeight: "600", color: COLORS.textPrimary, letterSpacing: 0.4 },
  assignmentValue: { fontSize: 11, color: COLORS.textDark, marginTop: 3 },
  detailsButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-end", marginTop: 12 },
  detailsText: { fontSize: 11, fontWeight: "600", color: COLORS.navigationActive },
});
