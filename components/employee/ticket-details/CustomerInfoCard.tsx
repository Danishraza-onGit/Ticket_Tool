import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type CustomerInfoCardProps = {
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export default function CustomerInfoCard({
  companyName,
  contactName,
  phone,
  email,
  address,
}: CustomerInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="person-outline"
            size={15}
            color={COLORS.navigationActive}
          />
        </View>

        <Text style={styles.title}>
          CUSTOMER INFORMATION
        </Text>
      </View>

      <InfoBlock
        label="COMPANY NAME"
        value={companyName}
      />

      <View style={styles.divider} />

      <View style={styles.twoColumnRow}>
        <View style={styles.column}>
          <InfoBlock
            label="CONTACT PERSON"
            value={contactName}
          />
        </View>

        <View style={styles.column}>
          <InfoBlock
            label="PHONE"
            value={phone}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <InfoBlock
        label="EMAIL"
        value={email}
      />

      <View style={styles.divider} />

      <InfoBlock
        label="ADDRESS"
        value={address}
      />
    </View>
  );
}

type InfoBlockProps = {
  label: string;
  value?: string;
};

function InfoBlock({
  label,
  value,
}: InfoBlockProps) {
  return (
    <View style={styles.infoBlock}>
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
    lineHeight: 16,
    color: COLORS.black,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});