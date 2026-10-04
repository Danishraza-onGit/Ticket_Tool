import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

import type {
  CustomerTicketStatus,
} from "../../../types/customer";

type ChangeStatusCardProps = {
  currentStatus: CustomerTicketStatus;

  onStatusPress?: (
    status: CustomerTicketStatus
  ) => void;
};

type StatusOption = {
  value: CustomerTicketStatus;
  label: string;
  icon:
    | "time-outline"
    | "sync-outline"
    | "checkmark-outline";
};

const statusOptions: StatusOption[] = [
  {
    value: "Pending",
    label: "Pending",
    icon: "time-outline",
  },
  {
    value: "In Progress",
    label: "In Progress",
    icon: "sync-outline",
  },
  {
    value: "Closed",
    label: "Closed",
    icon: "checkmark-outline",
  },
];

function getStatusColors(
  status: CustomerTicketStatus
) {
  switch (status) {
    case "Pending":
      return {
        text: COLORS.statusPendingText,
        // border: COLORS.statusPendingBorder,
        background:
          COLORS.statusPendingBackground,
      };

    case "In Progress":
      return {
        text: COLORS.statusInProgressText,
        // border: COLORS.statusInProgressBorder,
        //   COLORS.statusInProgressBorder,
        background:
          COLORS.statusInProgressBackground,
      };

    case "Closed":
      return {
        text: COLORS.statusClosedText,
        // border: COLORS.statusClosedBorder,
        background:
          COLORS.statusClosedBackground,
      };

    default:
      return {
        text: COLORS.textSecondary,
        // border: COLORS.border,
        background: COLORS.white,
      };
  }
}

export default function ChangeStatusCard({
  currentStatus,
  onStatusPress,
}: ChangeStatusCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        CHANGE STATUS
      </Text>

      <View style={styles.segmentContainer}>
        {statusOptions.map((option) => {
          const active =
            currentStatus === option.value;

          const colors =
            getStatusColors(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.segment,
                active && {
                  backgroundColor:
                    COLORS.white,
                //   borderColor:
                //     colors.border,
                },
              ]}
              onPress={() =>
                onStatusPress?.(
                  option.value
                )
              }
              activeOpacity={0.75}
            >
              <Ionicons
                name={option.icon}
                size={14}
                color={colors.text}
              />

              <Text
                style={[
                  styles.segmentText,
                  {
                    color: active
                      ? colors.text
                      : COLORS.textSecondary,
                  },
                  active &&
                    styles.activeText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,

    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,

    backgroundColor: COLORS.white,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  title: {
    fontSize: 10,
    fontWeight: "700",

    letterSpacing: 0.8,

    color: COLORS.textSecondary,
  },

  segmentContainer: {
    marginTop: 10,

    minHeight: 48,

    padding: 5,

    borderRadius: 12,

    backgroundColor:
      COLORS.searchButtonBackground,

    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  segment: {
    flex: 1,

    minHeight: 38,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: "transparent",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 5,

    paddingHorizontal: 6,
  },

  segmentText: {
    fontSize: 10,
    fontWeight: "600",

    textAlign: "center",
  },

  activeText: {
    fontWeight: "700",
  },
});