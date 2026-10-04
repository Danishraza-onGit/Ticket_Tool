import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type TicketSummaryCardProps = {
  ticketNo: string;
  createdOn?: string;

  status?: string;
  priority?: string;
  callType?: string;

  companyName?: string;
  contactName?: string;

  onCallPress?: () => void;
  onEmailPress?: () => void;
};

type BadgeStyle = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

function getStatusBadgeStyle(
  status?: string
): BadgeStyle {
  const normalizedStatus =
    status?.trim().toLowerCase();

  switch (normalizedStatus) {
    case "closed":
      return {
        backgroundColor:
          COLORS.statusClosedBackground,
        borderColor:COLORS.statusClosedBorder,
        textColor:COLORS.statusClosedText,
      };

    case "in progress":
      return {
        backgroundColor:
          COLORS.statusInProgressBackground,
        borderColor:
          COLORS.statusInProgressBorder,
        textColor:
          COLORS.statusInProgressText,
      };

    case "pending":
      return {
        backgroundColor:
          COLORS.statusPendingBackground,
        borderColor:
          COLORS.statusPendingBorder,
        textColor:
          COLORS.statusPendingText,
      };

    case "overdue":
      return {
        backgroundColor:
          COLORS.statusOverdueBackground,
        borderColor:
          COLORS.statusOverdueBorder,
        textColor:
          COLORS.statusOverdueText,
      };

    default:
      return {
        backgroundColor:
          COLORS.searchButtonBackground,
        borderColor:
          COLORS.border,
        textColor:
          COLORS.textBody,
      };
  }
}

function getPriorityBadgeStyle(
  priority?: string
): BadgeStyle {
  const normalizedPriority =
    priority?.trim().toUpperCase();

  switch (normalizedPriority) {
    case "P1":
      return {
        backgroundColor:
          COLORS.priorityP1Background,
        borderColor:
          COLORS.priorityP1Border,
        textColor:
          COLORS.priorityP1Text,
      };
      
    case "P2":
      return {
        backgroundColor:
          COLORS.priorityP2Background,
        borderColor:
          COLORS.priorityP2Border,
        textColor:
          COLORS.priorityP2Text,
      };

    case "P3":
      return {
        backgroundColor:
          COLORS.priorityP3Background,
        borderColor:
          COLORS.priorityP3Border,
        textColor:
          COLORS.priorityP3Text,
      };

    case "P4":
      return {
        backgroundColor:
          COLORS.priorityP4Background,
        borderColor:
          COLORS.priorityP4Border,
        textColor:
          COLORS.priorityP4Text,
      };


    default:
      return {
        backgroundColor:
          COLORS.searchButtonBackground,
        borderColor:
          COLORS.border,
        textColor:
          COLORS.textBody,
      };
  }
}

export default function TicketSummaryCard({
  ticketNo,
  createdOn,
  status,
  priority,
  callType,
  companyName,
  contactName,
  onCallPress,
  onEmailPress,
}: TicketSummaryCardProps) {
  const statusStyle =
    getStatusBadgeStyle(status);

  const priorityStyle =
    getPriorityBadgeStyle(priority);

  return (
    <View style={styles.card}>
      {/* Ticket number + date */}
      <View style={styles.topRow}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketLabel}>
            TICKET: {ticketNo}
          </Text>

          <View style={styles.ticketNumberRow}>
            <Text
              style={styles.ticketNumber}
              numberOfLines={1}
            >
              #{ticketNo}
            </Text>

            <Ionicons
              name="copy-outline"
              size={13}
              color={COLORS.iconGrey}
            />
          </View>
        </View>

        {createdOn ? (
          <View style={styles.dateBadge}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={COLORS.textMuted}
            />

            <Text style={styles.dateText}>
              Created On: {createdOn}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* Status / Priority / Call type */}
      <View style={styles.badgeRow}>
        {status ? (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusStyle.backgroundColor,
                borderColor:
                  statusStyle.borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    statusStyle.textColor,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    statusStyle.textColor,
                },
              ]}
            >
              {status}
            </Text>
          </View>
        ) : null}

        {priority ? (
          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor:
                  priorityStyle.backgroundColor,
                borderColor:
                  priorityStyle.borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.priorityCode,
                {
                  backgroundColor:
                    priorityStyle.backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityCodeText,
                  {
                    color:
                      priorityStyle.textColor,
                  },
                ]}
              >
                {priority}
              </Text>
            </View>

            <Text
              style={[
                styles.priorityText,
                {
                  color:
                    priorityStyle.textColor,
                },
              ]}
            >
              Priority {/*{priority}*/}
            </Text>
          </View>
        ) : null}

        {callType ? (
          <View style={styles.callTypeBadge}>
            <Text style={styles.callTypeText}>
              {callType}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Customer summary */}
      <View style={styles.customerCard}>
        <View style={styles.customerIcon}>
          <Ionicons
            name="business-outline"
            size={16}
            color={COLORS.navigationActive}
          />
        </View>

        <View style={styles.customerText}>
          <Text
            style={styles.companyName}
            numberOfLines={1}
          >
            {companyName || "—"}
          </Text>

          <Text
            style={styles.contactName}
            numberOfLines={1}
          >
            {contactName || "—"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.callButton,
          ]}
          onPress={onCallPress}
          activeOpacity={0.75}
          disabled={!onCallPress}
        >
          <Ionicons
            name="call-outline"
            size={17}
            color={COLORS.statusInProgressText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.emailButton,
          ]}
          onPress={onEmailPress}
          activeOpacity={0.75}
          disabled={!onEmailPress}
        >
          <Ionicons
            name="mail-outline"
            size={17}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  ticketInfo: {
    flex: 1,
  },

  ticketLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textLabel,
  },

  ticketNumberRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ticketNumber: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },

  dateBadge: {
    minHeight: 27,
    paddingHorizontal: 9,
    borderRadius: 7,
    backgroundColor:COLORS.searchButtonBackground,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  dateText: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },

  divider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: COLORS.divider,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  statusBadge: {
    minHeight: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },

  priorityBadge: {
    minHeight: 26,
    paddingHorizontal: 7,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  priorityCode: {
    minWidth: 22,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },

  priorityCodeText: {
    fontSize: 9,
    fontWeight: "700",
  },

  priorityText: {
    fontSize: 10,
    fontWeight: "600",
  },

  callTypeBadge: {
    minHeight: 26,
    paddingHorizontal: 11,
    borderRadius: 13,
    backgroundColor:COLORS.searchButtonBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  callTypeText: {
    fontSize: 10,
    fontWeight: "500",
    color:COLORS.textBody,
  },

  customerCard: {
    minHeight: 59,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor:COLORS.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
  },

  customerIcon: {
    width: 24,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  customerText: {
    flex: 1,
    paddingHorizontal: 7,
  },

  companyName: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.black,
  },

  contactName: {
    marginTop: 3,
    fontSize: 9,
    color:
      COLORS.textDark,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  callButton: {
    backgroundColor:COLORS.statusInProgressBackground,
  },

  emailButton: {
    backgroundColor:COLORS.navigationActive,
  },
});