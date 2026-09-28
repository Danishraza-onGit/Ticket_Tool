import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";


export type ExportDateRange =
  | "30 days"
  | "90 days"
  | "All";

type ExportTicketsModalProps = {
  visible: boolean;
  onClose: () => void;
  onExport: (dateRange: ExportDateRange) => void;
};

export default function ExportTicketsModal({
  visible,
  onClose,
  onExport,
}: ExportTicketsModalProps) {
  const [dateRange, setDateRange] =
    useState<ExportDateRange>("30 days");

  const [showDateOptions, setShowDateOptions] =
    useState(false);

  const handleClose = () => {
    setShowDateOptions(false);
    onClose();
  };

  const handleExport = () => {
    setShowDateOptions(false);
    onExport(dateRange);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={handleClose}
      >
        <Pressable
          style={styles.modalCard}
          onPress={(event) =>
            event.stopPropagation()
          }
        >
          <Text style={styles.title}>
            Export tickets to Excel?
          </Text>

          <Text style={styles.description}>
            This will download an .xlsx file of
            every ticket.
          </Text>

          <Text style={styles.fieldLabel}>
            Date Range
          </Text>

          <Pressable
            style={styles.rangeSelector}
            onPress={() =>
              setShowDateOptions(
                (current) => !current
              )
            }
          >
            <Text style={styles.rangeText}>
              Last {dateRange}
            </Text>

            <Ionicons
              name={
                showDateOptions
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={16}
              color={COLORS.textSubtle}
            />
          </Pressable>

          {showDateOptions && (
            <View style={styles.optionsContainer}>
              <RangeOption
                label="Last 30 days"
                selected={
                  dateRange === "30 days"
                }
                onPress={() => {
                  setDateRange("30 days");
                  setShowDateOptions(false);
                }}
              />

              <RangeOption
                label="Last 90 days"
                selected={
                  dateRange === "90 days"
                }
                onPress={() => {
                  setDateRange("90 days");
                  setShowDateOptions(false);
                }}
              />

              <RangeOption
                label="All"
                selected={
                  dateRange === "All"
                }
                onPress={() => {
                  setDateRange("All");
                  setShowDateOptions(false);
                }}
              />
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.exportButton}
              onPress={handleExport}
            >
              <Text style={styles.exportText}>
                Export
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type RangeOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function RangeOption({
  label,
  selected,
  onPress,
}: RangeOptionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.rangeOption,
        pressed && styles.rangeOptionPressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.rangeOptionText,
          selected &&
            styles.rangeOptionTextSelected,
        ]}
      >
        {label}
      </Text>

      {selected && (
        <Ionicons
          name="checkmark"
          size={17}
          color={COLORS.navigationActive}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.overlay,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 18,
  },

  modalCard: {
    width: "100%",
    maxWidth: 360,

    backgroundColor: COLORS.white,

    borderRadius: 18,

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",

    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 6,

    fontSize: 12,
    lineHeight: 18,

    color: COLORS.textDark,
  },

  fieldLabel: {
    marginTop: 20,

    fontSize: 11,
    fontWeight: "700",

    color: COLORS.textDark,
  },

  rangeSelector: {
    height: 42,

    marginTop: 7,

    borderRadius: 9,

    backgroundColor: COLORS.background,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rangeText: {
    fontSize: 13,

    color: COLORS.textPrimary,
  },

  optionsContainer: {
    marginTop: 5,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    borderRadius: 9,

    overflow: "hidden",

    backgroundColor: COLORS.white,
  },

  rangeOption: {
    minHeight: 40,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rangeOptionPressed: {
    backgroundColor: COLORS.background,
  },

  rangeOptionText: {
    fontSize: 13,

    color: COLORS.textSecondary,
  },

  rangeOptionTextSelected: {
    color: COLORS.navigationActive,
    fontWeight: "600",
  },

  actions: {
    marginTop: 18,

    flexDirection: "row",
    justifyContent: "flex-end",

    gap: 8,
  },

  cancelButton: {
    minWidth: 72,
    height: 34,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "600",

    color: COLORS.textBody,
  },

  exportButton: {
    minWidth: 72,
    height: 34,

    borderRadius: 9,

    backgroundColor: COLORS.navigationActive,

    alignItems: "center",
    justifyContent: "center",
  },

  exportText: {
    fontSize: 12,
    fontWeight: "600",

    color: COLORS.white,
  },
});