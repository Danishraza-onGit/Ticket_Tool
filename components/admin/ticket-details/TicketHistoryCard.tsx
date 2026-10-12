import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

import type {
  TicketHistoryItem,
} from "../../../types/customer";

import type {
  InventoryRepairFields,
} from "../../../types/ticket";

type TicketHistoryCardProps = {
  history?: TicketHistoryItem[];
  inventory?: InventoryRepairFields | null;
};

export default function TicketHistoryCard({
  history = [],
  inventory = null,
}: TicketHistoryCardProps) {
  const isClosed =
    history[0]?.label === "Closed";

  const formatInventoryDate = (
    value: string | null
  ) => {
    if (!value) {
      return "—";
    }

    const datePart =
      value.slice(0, 10);

    const date = new Date(
      `${datePart}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-GB"
    );
  };

  return (
    <View style={styles.card}>
      {/* HISTORY HEADER */}
      <View style={styles.headingRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="calendar-outline"
            size={15}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.title}>
          HISTORY
        </Text>
      </View>

      {/* STATUS HISTORY */}
      {history.length === 0 ? (
        <Text style={styles.emptyText}>
          No history available.
        </Text>
      ) : (
        <View style={styles.timeline}>
          {history.map((item, index) => {
            const isStatusItem =
              index === 0;

            /*
             * Current status dot:
             *
             * Pending / In Progress
             * → grey
             *
             * Closed
             * → green
             *
             * Ticket created
             * → always green
             */
            const dotIsGreen =
              !isStatusItem || isClosed;

            /*
             * Connecting line:
             *
             * Closed
             * → green
             *
             * Pending / In Progress
             * → grey
             */
            const lineIsGreen =
              isClosed;

            return (
              <View
                key={item.id}
                style={styles.historyRow}
              >
                <View
                  style={
                    styles.timelineColumn
                  }
                >
                  <View
                    style={[
                      styles.timelineDot,

                      dotIsGreen
                        ? styles.greenDot
                        : styles.greyDot,
                    ]}
                  />

                  {index <
                    history.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,

                          lineIsGreen
                            ? styles.greenLine
                            : styles.greyLine,
                        ]}
                      />
                    )}
                </View>

                <View
                  style={
                    styles.historyContent
                  }
                >
                  <Text
                    style={
                      styles.historyLabel
                    }
                    selectable
                  >
                    {item.label}
                  </Text>

                  <Text
                    style={
                      styles.historyDate
                    }
                    selectable
                  >
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* INWARD / OUTWARD */}
      {inventory && (
        <>
          <View
            style={
              styles.inventoryDivider
            }
          />

          <View
            style={
              styles.inventoryHeading
            }
          >
            <Ionicons
              name="laptop-outline"
              size={14}
              color={
                COLORS.textSecondary
              }
            />

            <Text
              style={
                styles.inventoryTitle
              }
            >
              INWARD / OUTWARD
            </Text>
          </View>

          <InventoryField
            label="INWARD DATE"
            value={formatInventoryDate(
              inventory.inwardDate
            )}
          />

          <InventoryField
            label="OUTWARD DATE"
            value={formatInventoryDate(
              inventory.outwardDate
            )}
          />

          <InventoryField
            label="REPAIR LOCATION"
            value={
              inventory.repairLocation ??
              "In-House"
            }
          />

          {inventory.repairLocation ===
            "Outsourced" && (
              <>
                <InventoryField
                  label="OUTSOURCE VENDOR"
                  value={
                    inventory.outsourceVendor ??
                    "—"
                  }
                />

                <InventoryField
                  label="EXPECTED RETURN DATE"
                  value={formatInventoryDate(
                    inventory.expectedReturnDate
                  )}
                />

                <InventoryField
                  label="DELIVERY PERSON"
                  value={
                    inventory.deliveryPerson ??
                    "—"
                  }
                />
              </>
            )}
        </>
      )}
    </View>
  );
}

function InventoryField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.inventoryField}>
      <Text
        style={
          styles.inventoryFieldLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.inventoryFieldValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,

    padding: 16,

    backgroundColor:
      COLORS.white,

    borderRadius: 16,

    borderWidth: 1,
    borderColor:
      COLORS.border,
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
      COLORS.statusClosedBackground,

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 11,
    fontWeight: "700",

    letterSpacing: 0.8,

    color:
      COLORS.textPrimary,
  },

  timeline: {
    marginTop: 2,
  },

  historyRow: {
    minHeight: 30,

    flexDirection: "row",
  },

  timelineColumn: {
    width: 20,

    paddingTop: 2,

    alignItems: "center",
  },

  timelineDot: {
    width: 12,
    height: 12,

    borderRadius: 6,

    borderWidth: 2,
  },

  greenDot: {
    backgroundColor:
      COLORS.activeStatus,

    borderColor:
      COLORS.statusClosedBackground,
  },

  greyDot: {
    backgroundColor:
      COLORS.textMuted,

    borderColor:
      COLORS.borderSoft,
  },

  timelineLine: {
    width: 2,

    flex: 1,
  },

  greenLine: {
    backgroundColor:
      COLORS.closedBorder,
  },

  greyLine: {
    backgroundColor:
      COLORS.border,
  },

  historyContent: {
    flex: 1,

    paddingLeft: 8,
    paddingBottom: 6,

    flexDirection: "row",
    justifyContent: "space-between",

    gap: 12,
  },

  historyLabel: {
    flex: 1,

    fontSize: 12.5,
    fontWeight: "400",

    color:
      COLORS.black,
  },

  historyDate: {
    fontSize: 10.5,

    color:
      COLORS.textLight,

    textAlign: "right",
  },

  emptyText: {
    fontSize: 10.5,

    color:
      COLORS.textMuted,
  },

  inventoryDivider: {
    height: 1,

    marginTop: 10,
    marginBottom: 14,

    backgroundColor:
      COLORS.divider,
  },

  inventoryHeading: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    marginBottom: 12,
  },

  inventoryTitle: {
    fontSize: 10.5,
    fontWeight: "700",

    letterSpacing: 0.4,

    color:
      COLORS.textSecondary,
  },

  inventoryField: {
    marginBottom: 11,
  },

  inventoryFieldLabel: {
    marginBottom: 3,

    fontSize: 9.5,
    fontWeight: "700",

    color:
      COLORS.textMuted,
  },

  inventoryFieldValue: {
    fontSize: 12.5,
    fontWeight: "500",

    color:
      COLORS.textBody,
  },
});