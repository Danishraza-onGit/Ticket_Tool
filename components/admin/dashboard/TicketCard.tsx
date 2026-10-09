import React from "react";
import { COLORS } from "../../../constants/colors";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  Ticket,
} from "../../../types/ticket";

type TicketCardProps = {
  ticket: Ticket;
  onViewDetails: () => void;
};

export default function TicketCard({
  ticket,
  onViewDetails,
}: TicketCardProps) {
  const statusStyle = getStatusStyle(ticket.status);
  const assignedToText =
  ticket.assignees.length > 0
    ? ticket.assignees
        .map((assignee) => assignee.displayName)
        .join(", ")
    : "-";

const displayTicketDate = ticket.ticketDate
  ? new Date(`${ticket.ticketDate}T00:00:00`).toLocaleDateString(
      "en-GB"
    )
  : "-";

const displayUpdatedAt = ticket.updatedAt
  ? new Date(ticket.updatedAt).toLocaleDateString("en-GB")
  : "-";


  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.ticketNumberContainer}>
          <Text style={styles.ticketNumber}>
            #{ticket.ticketNo}
          </Text>
        </View>

        <Text style={styles.date}>{displayTicketDate}</Text>
      </View>

      {/* Client + Status */}
      <View style={styles.mainRow}>
        <View style={styles.clientContainer}>
          <Text
            style={styles.clientName}
            numberOfLines={1}
          >
            {ticket.companyName}
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
                backgroundColor: statusStyle.backgroundColor,
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

      {/* Assignment */}
      <View style={styles.assignmentRow}>
        <View style={styles.assignmentColumn}>
          <Text style={styles.label}>ASSIGNED BY</Text>

          <Text
            style={styles.assignmentValue}
            numberOfLines={1}
          >
            {ticket.assignedBy || "-"}
          </Text>
        </View>

        <View
          style={[
            styles.assignmentColumn,
            styles.assignedToColumn,
          ]}
        >
          <Text style={styles.label}>ASSIGNED TO</Text>

          <Text
            style={styles.assignmentValue}
            numberOfLines={1}
          >
            {assignedToText}
          </Text>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <Text style={styles.updatedText}>
          Last Updated: {displayUpdatedAt}
        </Text>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={onViewDetails}
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

function getStatusStyle(status: Ticket["status"]) {
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
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
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
    color: COLORS.black,
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

  clientContainer: {
    flex: 1,
    paddingRight: 8,
  },

  clientName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },

  callType: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  priorityBadge: {
    backgroundColor: COLORS.priorityP3Background,
    /*borderWidth: 1,
    borderColor: COLORS.priorityP3Border,*/
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.priorityP2Text,
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

  assignedToColumn: {
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
    justifyContent: "space-between",
    marginTop: 12,
  },

  updatedText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textUpdated,
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