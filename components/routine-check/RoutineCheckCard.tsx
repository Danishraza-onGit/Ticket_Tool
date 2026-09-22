import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type {
  RoutineCheckRecord,
} from "../../types/routineCheck";

type RoutineCheckCardProps = {
  record: RoutineCheckRecord;
  onTicketPress: (ticketNo: string) => void;
};

export default function RoutineCheckCard({
  record,
  onTicketPress,
}: RoutineCheckCardProps) {
  const isSubmitted =
    record.status === "Submitted";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.employeeContainer}>
          <Text
            style={styles.employeeName}
            numberOfLines={1}
          >
            {record.employeeName}
          </Text>

          <Text style={styles.subtitle}>
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

      {isSubmitted && record.ticketNo ? (
        <>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.ticketRow}
            activeOpacity={0.7}
            onPress={() =>
              onTicketPress(record.ticketNo!)
            }
          >
            <View style={styles.ticketContent}>
              <Text style={styles.label}>
                TICKET NO.
              </Text>

              <Text style={styles.ticketNumber}>
                #{record.ticketNo}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={17}
              color="#3729AD"
            />
          </TouchableOpacity>

          <View style={styles.submittedSection}>
            <Text style={styles.label}>
              SUBMITTED AT
            </Text>

            <Text style={styles.submittedValue}>
              {record.submittedAt || "—"}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.divider} />

          <View style={styles.pendingSection}>
            <Ionicons
              name="time-outline"
              size={16}
              color="#9E0913"
            />

            <Text style={styles.pendingMessage}>
              Routine check has not been submitted yet.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 13,

    padding: 14,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  employeeContainer: {
    flex: 1,
    paddingRight: 10,
  },

  employeeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 10,
    color: "#2a2a2b",
  },

  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  submittedBadge: {
    backgroundColor: "#E8F7EF",
  },

  pendingBadge: {
    backgroundColor: "#FBECEC",
  },

  statusText: {
    fontSize: 9,
    fontWeight: "700",
  },

  submittedText: {
    color: "#016144",
  },

  pendingText: {
    color: "#9E0913",
  },

  divider: {
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 12,
  },

  ticketRow: {
    minHeight: 48,

    borderRadius: 10,
    backgroundColor: "#F7F7F8",

    paddingHorizontal: 12,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",
  },

  ticketContent: {
    flex: 1,
  },

  label: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#2a2a2b",
  },

  ticketNumber: {
    marginTop: 4,

    fontSize: 13,
    fontWeight: "700",
    color: "#3729AD",
  },

  submittedSection: {
    marginTop: 12,
  },

  submittedValue: {
    marginTop: 4,
    fontSize: 10.5,
    color: "#2a2a2b",
  },

  pendingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  pendingMessage: {
    flex: 1,
    fontSize: 10.5,
    color: "#2a2a2b",
  },
});