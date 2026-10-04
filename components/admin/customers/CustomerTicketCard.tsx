import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  CustomerTicket,
} from "../../../types/customer";
import { COLORS } from "@/constants/colors";

type CustomerTicketCardProps = {
  ticket: CustomerTicket;
  onTicketPress: () => void;
};

export default function CustomerTicketCard({
  ticket,
  onTicketPress,
}: CustomerTicketCardProps) {
  const statusStyle = getStatusStyle(ticket.status);

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.ticketNumberContainer}
          onPress={onTicketPress}
          activeOpacity={0.7}
        >
          <Text style={styles.ticketNumber}>
            #{ticket.ticketNo}
          </Text>
        </TouchableOpacity>

        <Text style={styles.date}>
          {ticket.date}
        </Text>
      </View>

      {/* Problem + badges */}
      <View style={styles.mainRow}>
        <View style={styles.problemContainer}>
          <Text
            style={styles.problem}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {ticket.problem}
          </Text>

          <Text
            style={styles.callType}
            numberOfLines={1}
          >
            {ticket.callType}
          </Text>
        </View>

        <View style={styles.badges}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>
              {ticket.priority}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusStyle.backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: statusStyle.textColor,
                },
              ]}
            >
              {ticket.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Ticket-specific information */}
      <View style={styles.assignmentRow}>
        <View style={styles.assignmentColumn}>
          <Text style={styles.label}>
            ASSIGNED TO
          </Text>

          <Text
            style={styles.assignmentValue}
            numberOfLines={1}
          >
            {ticket.assignedTo || "-"}
          </Text>
        </View>

        <View
          style={[
            styles.assignmentColumn,
            styles.deadlineColumn,
          ]}
        >
          <Text style={styles.label}>
            DEADLINE
          </Text>

          <Text
            style={styles.assignmentValue}
            numberOfLines={1}
          >
            {ticket.deadline || "—"}
          </Text>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={onTicketPress}
          activeOpacity={0.7}
        >
          <Text style={styles.detailsText}>
            View Details
          </Text>

          <Ionicons
            name="chevron-forward"
            size={15}
            color={COLORS.navigationActive}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStatusStyle(
  status: CustomerTicket["status"]
) {
  switch (status) {
    case "In Progress":
      return {
        backgroundColor: COLORS.statusInProgressBackground,
        textColor: COLORS.statusInProgressText,
      };

    case "Pending":
      return {
        backgroundColor: COLORS.statusPendingBackground,
        textColor: COLORS.statusPendingText,
      };

    case "Overdue":
      return {
        backgroundColor: COLORS.statusOverdueBackground,
        textColor: COLORS.statusOverdueText,
      };

    case "Closed":
    default:
      return {
        backgroundColor: COLORS.statusClosedBackground,
        textColor: COLORS.statusClosedText,
      };
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ticketNumberContainer: {
    backgroundColor: COLORS.ticketNumberBackground,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  ticketNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  date: {
    fontSize: 11,
    color: COLORS.textNeutral,
  },

  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  problemContainer: {
    flex: 1,
    paddingRight: 8,
  },

  problem: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    lineHeight: 19,
  },

  callType: {
    fontSize: 12,
    color: COLORS.textNeutral,
    marginTop: 3,
  },

  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  priorityBadge: {
    backgroundColor: COLORS.priorityP3Background,
    borderWidth: 1,
    borderColor: COLORS.priorityP3Border,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.priorityP3Text,
  },

  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 10,
  },

  assignmentRow: {
    flexDirection: "row",
  },

  assignmentColumn: {
    flex: 1,
  },

  deadlineColumn: {
    alignItems: "flex-end",
  },

  label: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: 0.4,
  },

  assignmentValue: {
    fontSize: 11,
    color: COLORS.textDark,
    marginTop: 3,
    maxWidth: "100%",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
  },

  bottomInfo: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textNeutral,
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailsText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.navigationActive,
  },
});