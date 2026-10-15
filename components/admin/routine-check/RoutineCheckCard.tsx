
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";
import { getInitials } from "../../../utils/getInitials";
import type { RoutineCheckRecord } from "../../../types/routineCheck";

type RoutineCheckCardProps = {
  record: RoutineCheckRecord;
  onTicketPress: (ticketNo: string) => void;
};

export default function RoutineCheckCard({
  record,
  onTicketPress,
}: RoutineCheckCardProps) {
  const isSubmitted = record.status === "Submitted";
  const hasTicket = Boolean(record.ticketNo);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(record.employeeName)}
          </Text>
        </View>

        <View style={styles.employeeInfo}>
          <Text
            style={styles.employeeName}
            numberOfLines={1}
          >
            {record.employeeName}
          </Text>

          <Text
            style={styles.subtitle}
            numberOfLines={2}
          >
            Routine system-health checklist
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isSubmitted
              ? styles.submittedBadge
              : styles.pendingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isSubmitted
                ? styles.submittedText
                : styles.pendingText,
            ]}
          >
            {record.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {isSubmitted ? (
        <View style={styles.detailsSection}>
          <TouchableOpacity
            style={styles.ticketRow}
            onPress={() => {
              if (record.ticketNo) {
                onTicketPress(record.ticketNo);
              }
            }}
            disabled={!hasTicket}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              record.ticketNo
                ? `View ticket ${record.ticketNo}`
                : "No ticket available"
            }
          >
            <View style={styles.ticketInfo}>
              <Text style={styles.label}>
                TICKET NO.
              </Text>

              <Text style={styles.ticketNumber}>
                {record.ticketNo
                  ? `#${record.ticketNo}`
                  : "—"}
              </Text>
            </View>

            {hasTicket && (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.navigationActive}
              />
            )}
          </TouchableOpacity>

          <View style={styles.submittedSection}>
            <Text style={styles.label}>
              SUBMITTED AT
            </Text>

            <Text style={styles.submittedValue}>
              {record.submittedAt || "—"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.pendingSection}>
          <Ionicons
            name="time-outline"
            size={16}
            color={COLORS.danger}
          />

          <Text style={styles.pendingMessage}>
            Routine check has not been submitted yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.avatarBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  employeeName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.textNeutral,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  submittedBadge: {
    backgroundColor: COLORS.statusClosedBackground,
  },
  pendingBadge: {
    backgroundColor: COLORS.statusPendingBackground,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "700",
  },
  submittedText: {
    color: COLORS.statusClosedText,
  },
  pendingText: {
    color: COLORS.statusPendingText,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  detailsSection: {
    gap: 12,
  },
  ticketRow: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  ticketInfo: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: COLORS.textNeutral,
  },
  ticketNumber: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },
  submittedSection: {
    paddingHorizontal: 2,
  },
  submittedValue: {
    marginTop: 5,
    fontSize: 11,
    color: COLORS.textBody,
  },
  pendingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 3,
  },
  pendingMessage: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 16,
    color: COLORS.danger,
  },
});
