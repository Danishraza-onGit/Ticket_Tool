
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";
import { getInitials } from "../../../utils/getInitials";
import type { ActivityLogItem } from "../../../types/activity";

type ActivityLogCardProps = {
  activity: ActivityLogItem;
  onReferencePress: () => void;
};

export default function ActivityLogCard({
  activity,
  onReferencePress,
}: ActivityLogCardProps) {
  const isTicket = activity.referenceType === "ticket";
  const isProject = activity.referenceType === "project";

  const hasReference = Boolean(activity.reference);
  const canNavigate =
    hasReference &&
    (isTicket || isProject) &&
    activity.referenceSrNo !== null;

  const referenceLabel = isProject
    ? "PROJECT REFERENCE"
    : "TICKET REFERENCE";

  const referenceNumber = isProject
    ? activity.reference
    : `#${activity.reference.replace(/^#/, "")}`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(activity.person)}
          </Text>
        </View>

        <View style={styles.personInfo}>
          <Text
            style={styles.person}
            numberOfLines={1}
          >
            {activity.person}
          </Text>

          <Text
            style={styles.time}
            numberOfLines={2}
          >
            {activity.time}
          </Text>
        </View>

        {hasReference && (
          <View style={styles.referenceSection}>
            <Text style={styles.referenceLabel}>
              {referenceLabel}
            </Text>

            {canNavigate ? (
              <TouchableOpacity
                onPress={onReferencePress}
                activeOpacity={0.65}
                accessibilityRole="link"
                accessibilityLabel={`Open ${isProject ? "project" : "ticket"} ${activity.reference}`}
                hitSlop={8}
              >
                <Text
                  style={styles.referenceLink}
                  numberOfLines={1}
                >
                  {referenceNumber}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={styles.referenceText}
                numberOfLines={1}
              >
                {referenceNumber}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <Ionicons
          name="pulse-outline"
          size={15}
          color={COLORS.navigationActive}
        />

        <Text
          style={styles.action}
          numberOfLines={2}
        >
          {activity.action}
        </Text>
      </View>

      {Boolean(activity.details) && (
        <View style={styles.detailsSection}>
          <Text style={styles.detailsLabel}>
            DETAILS
          </Text>

          <Text
            style={styles.details}
            numberOfLines={4}
            ellipsizeMode="tail"
          >
            {activity.details}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 13,
    marginBottom: 11,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.avatarBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  personInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    marginRight: 6,
  },
  person: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  time: {
    marginTop: 5,
    fontSize: 10,
    color: COLORS.textNeutral,
  },
  referenceSection: {
    maxWidth: "45%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  referenceLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: COLORS.textNeutral,
    textAlign: "right",
  },
  referenceLink: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navigationActive,
    textAlign: "right",
  },
  referenceText: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  action: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  detailsSection: {
    marginTop: 12,
  },
  detailsLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.textNeutral,
  },
  details: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textBody,
  },
});
