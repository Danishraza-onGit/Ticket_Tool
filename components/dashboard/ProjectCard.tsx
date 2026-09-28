import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

import type { Project } from "../../types/project";

type ProjectCardProps = {
  project: Project;
  onViewDetails: () => void;
};

export default function ProjectCard({
  project,
  onViewDetails,
}: ProjectCardProps) {
  const statusStyle = getStatusStyle(project.status);

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.projectNumberContainer}>
          <Text style={styles.projectNumber}>
            #{project.projectNo}
          </Text>
        </View>

        <Text style={styles.date}>
          {project.startDate}
        </Text>
      </View>

      {/* Company + Status */}
      <View style={styles.mainRow}>
        <View style={styles.companyContainer}>
          <Text
            style={styles.companyName}
            numberOfLines={1}
          >
            {project.companyName}
          </Text>

          <Text
            style={styles.problem}
            numberOfLines={1}
          >
            {project.problem}
          </Text>
        </View>

        <View style={styles.badges}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>
              {project.priority}
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
              {project.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Assignment */}
      <View style={styles.assignmentRow}>
        <View style={styles.assignmentColumn}>
          <Text style={styles.label}>
            ASSIGNED BY
          </Text>

          <Text
            style={styles.assignmentValue}
            numberOfLines={1}
          >
            {project.assignedBy || "-"}
          </Text>
        </View>

        <View
          style={[
            styles.assignmentColumn,
            styles.assignedToColumn,
          ]}
        >
          <Text style={styles.label}>
            ASSIGNED TO
          </Text>

          <Text
            style={styles.assignmentValue}
            numberOfLines={1}
          >
            {project.assignedTo || "-"}
          </Text>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <Text style={styles.deadlineText}>
          Deadline: {project.deadline}
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

function getStatusStyle(status: Project["status"]) {
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

    case "Completed":
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

  projectNumberContainer: {
    backgroundColor: COLORS.ticketNumberBackground,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  projectNumber: {
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

  companyContainer: {
    flex: 1,
    paddingRight: 8,
  },

  companyName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },

  problem: {
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
    color: COLORS.priorityP3Text,
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  priorityText: {
    color:COLORS.priorityP3Text,
    fontSize: 10,
    fontWeight: "700",
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

  deadlineText: {
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