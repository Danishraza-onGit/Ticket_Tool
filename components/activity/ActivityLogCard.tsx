import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type {
  ActivityLogItem,
} from "../../types/activity";

type ActivityLogCardProps = {
  activity: ActivityLogItem;
  onReferencePress: () => void;
};

export default function ActivityLogCard({
  activity,
  onReferencePress,
}: ActivityLogCardProps) {
  return (
    <View style={styles.card}>
      {/* Person + Time */}
      <View style={styles.topRow}>
        <Text
          style={styles.person}
          numberOfLines={1}
        >
          {activity.person}
        </Text>

        <Text style={styles.time}>
          {activity.time}
        </Text>
      </View>

      {/* Action */}
      <Text style={styles.action}>
        {activity.action}
      </Text>

      {/* Reference */}
      <TouchableOpacity
        style={styles.referenceRow}
        onPress={onReferencePress}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.label}>
            REFERENCE
          </Text>

          <Text style={styles.reference}>
            #{activity.reference}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={17}
          color="#3729AD"
        />
      </TouchableOpacity>

      {/* Details */}
      {activity.details ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>
            DETAILS
          </Text>

          <Text
            style={styles.details}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {activity.details}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E6EC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  person: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },

  time: {
    fontSize: 10,
    color: "#2a2a2b",
  },

  action: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#2a2a2b",
  },

  referenceRow: {
    marginTop: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,

    borderRadius: 9,
    backgroundColor: "#F7F8FA",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#2a2a2b",
  },

  reference: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#3729AD",
  },

  detailsContainer: {
    marginTop: 11,
  },

  details: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: "#2a2a2b",
  },
});