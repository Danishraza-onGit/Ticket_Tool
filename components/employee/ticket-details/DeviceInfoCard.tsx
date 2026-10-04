import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type DeviceInfoCardProps = {
  model?: string;
  serialNumbers?: string;
  internalTag?: string;
  callType?: string;
  mode?: string;
};

export default function DeviceInfoCard({
  model,
  serialNumbers,
  internalTag,
  callType,
  mode,
}: DeviceInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="desktop-outline"
            size={15}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.title}>
          DEVICE INFORMATION
        </Text>
      </View>

      <InfoRow
        label="MODEL"
        value={model}
      />

      <View style={styles.divider} />

      <InfoRow
        label="SERIAL NUMBER(S)"
        value={serialNumbers}
      />

      <View style={styles.divider} />

      <InfoRow
        label="INTERNAL TAG"
        value={internalTag}
      />

      <View style={styles.divider} />

      <InfoRow
        label="CALL TYPE"
        value={callType}
      />

      <View style={styles.divider} />

      <InfoRow
        label="MODE"
        value={mode}
      />
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value?: string;
};

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={styles.value}
        selectable
      >
        {value || "—"}
      </Text>
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
    backgroundColor:COLORS.inProgressBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: COLORS.navigationActive,
  },

  infoRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 10,
  },

  label: {
    flex: 1,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textNeutral,
  },

  value: {
    flex: 1.4,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.black,
  },

  divider: {
    height: 1,
    backgroundColor:COLORS.divider,
  },
});