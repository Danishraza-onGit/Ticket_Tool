import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

import type {
  TicketRemark,
} from "../../../types/customer";

type RemarksTimelineCardProps = {
  remarks?: TicketRemark[];
};

export default function RemarksTimelineCard({
  remarks = [],
}: RemarksTimelineCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.navigationActive}
          />
        </View>

        <Text style={styles.title}>
          REMARKS TIMELINE
        </Text>
      </View>

      {remarks.length === 0 ? (
        <Text style={styles.emptyText}>
          No remarks available.
        </Text>
      ) : (
        remarks.map((remark) => (
          <View
            key={remark.id}
            style={styles.remarkCard}
          >
            <View style={styles.metaRow}>
              <Text
                style={styles.dateText}
                selectable
              >
                {remark.createdAt}
              </Text>

              <View style={styles.authorBadge}>
                <Text
                  style={styles.authorText}
                  selectable
                >
                  {remark.createdBy}
                </Text>
              </View>
            </View>

            <Text
              style={styles.message}
              selectable
            >
              {remark.message}
            </Text>
          </View>
        ))
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
      COLORS.statusInProgressBackground,

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

  remarkCard: {
    padding: 13,

    borderRadius: 11,

    backgroundColor:
      COLORS.surfaceSoft,

    borderWidth: 1,
    borderColor:
      COLORS.borderSoft,

    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 10,
  },

  dateText: {
    flex: 1,

    fontSize: 9,
    fontWeight: "600",

    color:
      COLORS.navigationActive,
  },

  authorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 6,

    backgroundColor:
      COLORS.divider,
  },

  authorText: {
    fontSize: 8.5,
    fontWeight: "600",

    color:
      COLORS.textSecondary,
  },

  message: {
    marginTop: 10,

    fontSize: 11,
    lineHeight: 17,

    color: COLORS.black,
  },

  emptyText: {
    fontSize: 10.5,

    color:
      COLORS.textMuted,
  },
});