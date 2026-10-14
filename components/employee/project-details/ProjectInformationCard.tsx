import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type ProjectInformationCardProps = {
  title: string;
  icon: IconName;
  fields?: {
    label: string;
    value: string | number | null | undefined;
  }[];
  children?: React.ReactNode;
};

export default function ProjectInformationCard({
  title,
  icon,
  fields = [],
  children,
}: ProjectInformationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={15}
            color={COLORS.navigationActive}
          />
        </View>

        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>

      {fields.map((field, index) => (
        <View key={`${field.label}-${index}`}>
          {index > 0 && <View style={styles.divider} />}

          <View style={styles.infoBlock}>
            <Text style={styles.label}>{field.label.toUpperCase()}</Text>
            <Text style={styles.value} selectable>
              {field.value === null ||
              field.value === undefined ||
              field.value === ""
                ? "—"
                : String(field.value)}
            </Text>
          </View>
        </View>
      ))}

      {children}
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
    backgroundColor: COLORS.statusInProgressBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: COLORS.navigationActive,
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
    lineHeight: 16,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});
