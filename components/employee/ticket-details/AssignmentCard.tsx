import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type AssignmentCardProps = {
  assignedTo?: string;
  assignedBy?: string;
  accountManager?: string;
  priority?: string;
  deadline?: string;
};

export default function AssignmentCard({
  assignedTo,
  assignedBy,
  accountManager,
  priority,
  deadline,
}: AssignmentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="people-outline"
            size={15}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.title}>
          ASSIGNMENT
        </Text>
      </View>

      <View style={styles.twoColumnRow}>
        <View style={styles.column}>
          <InfoBlock
            label="ASSIGNED TO"
            value={assignedTo}
            highlighted
          />
        </View>

        <View style={styles.column}>
          <InfoBlock
            label="ASSIGNED BY"
            value={assignedBy}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <InfoBlock
        label="ACCOUNT MANAGER"
        value={accountManager}
      />

      <View style={styles.divider} />

      <View style={styles.twoColumnRow}>
        <View style={styles.column}>
          <InfoBlock
            label="PRIORITY"
            value={priority}
            priority
          />
        </View>

        <View style={styles.column}>
          <InfoBlock
            label="DEADLINE"
            value={deadline}
          />
        </View>
      </View>
    </View>
  );
}

type InfoBlockProps = {
  label: string;
  value?: string;
  highlighted?: boolean;
  priority?: boolean;
};

function InfoBlock({
  label,
  value,
  highlighted = false,
  priority = false,
}: InfoBlockProps) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.label}>
        {label}
      </Text>

      {highlighted ? (
        <View style={styles.highlightedValue}>
          <Text style={styles.highlightedValueText}
          selectable>
            {value || "—"}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.value,
            priority &&
              styles.priorityValue,
          ]}
          selectable
        >
          {value || "—"}
        </Text>
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

    marginBottom: 16,
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
      COLORS.inProgressBackground,

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: COLORS.navigationActive,
  },

  twoColumnRow: {
    flexDirection: "row",
    gap: 18,
  },

  column: {
    flex: 1,
  },

  infoBlock: {
    paddingVertical: 10,
  },

  label: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: COLORS.textNeutral,
  },

  value: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.black,
  },

  highlightedValue: {
    alignSelf: "flex-start",
    marginTop: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor:
      COLORS.searchButtonBackground,
  },

  highlightedValueText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.black,
  },

  priorityValue: {
    color: COLORS.priorityP3Text,
  },

  divider: {
    height: 1,
    backgroundColor:COLORS.divider,
  },
});