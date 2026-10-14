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
  ProjectStatus,
} from "../../../types/project";

type ChangeStatusCardProps = {
  currentStatus: ProjectStatus;

  onStatusPress?: (
    status: ProjectStatus
  ) => void;
};

type StatusOption = {
  value: ProjectStatus;
  label: string;
  icon:
  | "hourglass-outline"
  | "refresh-outline"
  | "checkmark-circle-outline";
};

const statusOptions: StatusOption[] = [
  {
    value: "Pending",
    label: "Pending",
    icon: "hourglass-outline",
  },
  {
    value: "In Progress",
    label: "In Progress",
    icon: "refresh-outline",
  },
  {
    value: "Closed",
    label: "Closed",
    icon: "checkmark-circle-outline",
  },
];

function getStatusColors(
  status: ProjectStatus
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
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.navigationActive}
          />
        </View>
        <Text style={styles.title}>
          STATUS
        </Text>
      </View>

      <View style={styles.segmentContainer}>
        {statusOptions.map((option) => {
          const active =
            currentStatus === option.value;

          const colors =
            getStatusColors(option.value);

          const disabled =
            currentStatus === "Closed" &&
            option.value !== "Pending";

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.segment,
                active && {
                  backgroundColor:
                    COLORS.white,
                },
                disabled &&
                styles.disabledSegment,
              ]}
              onPress={() =>
                !disabled &&
                onStatusPress?.(
                  option.value
                )
              }
              activeOpacity={
                disabled ? 1 : 0.75
              }
              disabled={disabled}
            >
              <Ionicons
                name={option.icon}
                size={14}
                color={
                  disabled
                    ? COLORS.textMuted
                    : colors.text
                }
              />

              <Text
                style={[
                  styles.segmentText,
                  {
                    color: disabled
                      ? COLORS.textMuted
                      : active
                        ? colors.text
                        : COLORS.textSecondary,
                  },
                  active &&
                  !disabled &&
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

  disabledSegment: {
    opacity: 0.45,
  },

  headingRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 9,

    marginBottom: 1,
  },

  title: {
    fontSize: 11,
    fontWeight: "700",

    letterSpacing: 0.8,

    color: COLORS.textPrimary,
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

  iconContainer: {
    width: 25,
    height: 25,

    borderRadius: 7,

    backgroundColor:
      COLORS.statusInProgressBackground,

    alignItems: "center",
    justifyContent: "center",
  },
});