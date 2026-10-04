import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type ProblemDescriptionCardProps = {
  problem?: string;
};

export default function ProblemDescriptionCard({
  problem,
}: ProblemDescriptionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="warning-outline"
            size={15}
            color={COLORS.statusInProgressText}
          />
        </View>

        <Text style={styles.title}>
          PROBLEM DESCRIPTION
        </Text>
      </View>

      <View style={styles.problemContainer}>
        <Text style={styles.problemText}
        selectable>
          {problem || "—"}
        </Text>
      </View>
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
    backgroundColor:COLORS.statusInProgressBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: COLORS.navigationActive,
  },

  problemContainer: {
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSoft,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },

  problemText: {
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.textPrimary,
  },
});