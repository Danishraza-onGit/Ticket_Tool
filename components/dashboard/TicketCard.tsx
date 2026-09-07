import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type Ticket = {
  ticketNo: string;
  date: string;
  clientName: string;
  callType: string;
  priority: string;
  status: "Pending" | "In Progress" | "Closed" | "Overdue";
  assignedBy: string;
  assignedTo: string;
  updatedAt: string;
};

type TicketCardProps = {
  ticket: Ticket;
  onViewDetails: () => void;
};

export default function TicketCard({
  ticket,
  onViewDetails,
}: TicketCardProps) {
  const statusStyle = getStatusStyle(ticket.status);

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.ticketNumberContainer}>
          <Text style={styles.ticketNumber}>
            #{ticket.ticketNo}
          </Text>
        </View>

        <Text style={styles.date}>{ticket.date}</Text>
      </View>

      {/* Client + Status */}
      <View style={styles.mainRow}>
        <View style={styles.clientContainer}>
          <Text
            style={styles.clientName}
            numberOfLines={1}
          >
            {ticket.clientName}
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
            {ticket.assignedTo}
          </Text>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <Text style={styles.updatedText}>
          Last Updated: {ticket.updatedAt}
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
            color="#174F8A"
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
        backgroundColor: "#DDF0FF",
        textColor: "#1470B8",
      };

    case "Pending":
      return {
        backgroundColor: "#FFF2CC",
        textColor: "#B56A00",
      };

    case "Overdue":
      return {
        backgroundColor: "#FFE4E4",
        textColor: "#C43D3D",
      };

    case "Closed":
    default:
      return {
        backgroundColor: "#D5F6E5",
        textColor: "#008557",
      };
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFE6EF",
    padding: 14,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ticketNumberContainer: {
    backgroundColor: "#F0F4F8",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  ticketNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: "#18263A",
  },

  date: {
    fontSize: 11,
    color: "#8DA0B8",
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
    color: "#18263A",
  },

  callType: {
    fontSize: 12,
    color: "#52647B",
    marginTop: 3,
  },

  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  priorityBadge: {
    backgroundColor: "#FFF7D9",
    borderWidth: 1,
    borderColor: "#F5D46B",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B86A00",
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
    backgroundColor: "#E9EEF4",
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
    color: "#8CA0B8",
    letterSpacing: 0.4,
  },

  assignmentValue: {
    fontSize: 11,
    color: "#26364C",
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
    color: "#91A2B8",
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailsText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#174F8A",
  },
});