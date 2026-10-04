import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

import type {
  TicketHistoryItem,
} from "../../../types/customer";

type TicketHistoryCardProps = {
  history?: TicketHistoryItem[];
};

export default function TicketHistoryCard({
  history = [],
}: TicketHistoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.title}>
          HISTORY
        </Text>
      </View>

      {history.length === 0 ? (
        <Text style={styles.emptyText}>
          No history available.
        </Text>
      ) : (
        <View style={styles.timeline}>
          {history.map(
            (item, index) => (
              <View
                key={item.id}
                style={styles.historyRow}
              >
                <View
                  style={
                    styles.timelineColumn
                  }
                >
                  <View
                    style={
                      styles.timelineDot
                    }
                  />

                  {index <
                    history.length -
                      1 && (
                    <View
                      style={
                        styles.timelineLine
                      }
                    />
                  )}
                </View>

                <View
                  style={
                    styles.historyContent
                  }
                >
                  <Text
                    style={
                      styles.historyLabel
                    }
                    selectable
                  >
                    {item.label}
                  </Text>

                  <Text
                    style={
                      styles.historyDate
                    }
                    selectable
                  >
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,

    padding: 16,

    backgroundColor: COLORS.white,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headingRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 9,

    marginBottom: 14,
  },

  iconContainer: {
    width: 25,
    height: 25,

    borderRadius: 7,

    backgroundColor:
      COLORS.statusClosedBackground,

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 11,
    fontWeight: "700",

    letterSpacing: 0.8,

    color:
      COLORS.textSecondary,
  },

  timeline: {
    marginTop: 2,
  },

  historyRow: {
    minHeight: 49,

    flexDirection: "row",
  },

  timelineColumn: {
    width: 20,

    alignItems: "center",
  },

  timelineDot: {
    width: 12,
    height: 12,

    borderRadius: 6,

    backgroundColor:
      COLORS.activeStatus,

    borderWidth: 2,
    borderColor:
      COLORS.statusClosedBackground,
  },

  timelineLine: {
    width: 2,

    flex: 1,

    backgroundColor:
      COLORS.closedBorder,
  },

  historyContent: {
    flex: 1,

    paddingLeft: 8,
    paddingBottom: 12,

    flexDirection: "row",
    justifyContent: "space-between",

    gap: 12,
  },

  historyLabel: {
    flex: 1,

    fontSize: 10.5,
    fontWeight: "600",

    color: COLORS.black,
  },

  historyDate: {
    fontSize: 8.5,

    color:
      COLORS.textLight,

    textAlign: "right",
  },

  emptyText: {
    fontSize: 10.5,

    color:
      COLORS.textMuted,
  },
});