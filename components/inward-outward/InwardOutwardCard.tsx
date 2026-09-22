import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  InwardOutwardItem,
} from "../../types/inwardOutward";

type Props = {
  item: InwardOutwardItem;
  onTicketPress: () => void;
};

export default function InwardOutwardCard({
  item,
  onTicketPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onTicketPress}
          activeOpacity={0.7}
          style={styles.ticketButton}
        >
          <Text style={styles.ticketNumber}>
            #{item.ticketNo}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={15}
            color="#3729AD"
          />
        </TouchableOpacity>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text
        style={styles.company}
        numberOfLines={1}
      >
        {item.company}
      </Text>

      <Text
        style={styles.model}
        numberOfLines={1}
      >
        {item.model}
      </Text>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <InfoBlock
          label="SERIAL NUMBER(S)"
          value={item.serialNumbers}
        />

        <InfoBlock
          label="QTY"
          value={String(item.quantity)}
          alignRight
        />
      </View>

      <View style={styles.infoRow}>
        <InfoBlock
          label="INWARD"
          value={item.inwardDate}
        />

        <InfoBlock
          label="OUTWARD"
          value={item.outwardDate}
          alignRight
        />
      </View>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={14}
          color="#3729AD"
        />

        <Text style={styles.locationLabel}>
          Location:
        </Text>

        <Text style={styles.locationValue}>
          {item.location}
        </Text>
      </View>
    </View>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
  alignRight?: boolean;
};

function InfoBlock({
  label,
  value,
  alignRight = false,
}: InfoBlockProps) {
  return (
    <View
      style={[
        styles.infoBlock,
        alignRight && styles.alignRight,
      ]}
    >
      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={styles.value}
        numberOfLines={1}
      >
        {value || "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 12,

    padding: 14,
    marginBottom: 11,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  ticketButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  ticketNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3729AD",
  },

  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#D1FBE5",
  },

  statusText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#016144",
  },

  company: {
    marginTop: 10,

    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },

  model: {
    marginTop: 3,

    fontSize: 11,
    color: "#2a2a2b",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 11,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 11,
  },

  infoBlock: {
    flex: 1,
    paddingRight: 8,
  },

  alignRight: {
    alignItems: "flex-end",
    paddingRight: 0,
  },

  label: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#2a2a2b",
  },

  value: {
    marginTop: 3,
    fontSize: 10.5,
    color: "#000000",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2a2a2b",
  },

  locationValue: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3729AD",
  },
});