import React from "react";

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type CallReportTimeModalProps = {
  visible: boolean;

  date: string;
  time: string;

  onDatePress?: () => void;
  onTimePress?: () => void;

  onClose: () => void;
  onPrint: () => void;
};

export default function CallReportTimeModal({
  visible,
  date,
  time,
  onDatePress,
  onTimePress,
  onClose,
  onPrint,
}: CallReportTimeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={styles.modalCard}
          onPress={(event) =>
            event.stopPropagation()
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              Call Report Time
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={19}
                color={COLORS.iconBlack}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsRow}>
            {/* Date */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Date
              </Text>

              <TouchableOpacity
                style={styles.selector}
                onPress={onDatePress}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={COLORS.iconGrey}
                />

                <Text
                  style={styles.selectorText}
                  numberOfLines={1}
                >
                  {date}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={COLORS.iconGrey}
                />
              </TouchableOpacity>
            </View>

            {/* Time */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Time
              </Text>

              <TouchableOpacity
                style={styles.selector}
                onPress={onTimePress}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={COLORS.iconGrey}
                />

                <Text
                  style={styles.selectorText}
                  numberOfLines={1}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.printButton}
              onPress={onPrint}
              activeOpacity={0.8}
            >
              <Ionicons
                name="print-outline"
                size={15}
                color={COLORS.white}
              />

              <Text style={styles.printText}>
                Print
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.overlay,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    maxWidth: 390,

    padding: 18,

    borderRadius: 18,

    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",

    color: COLORS.black,
  },

  closeButton: {
    width: 32,
    height: 32,

    borderRadius: 9,

    backgroundColor:
      COLORS.searchButtonBackground,

    alignItems: "center",
    justifyContent: "center",
  },

  fieldsRow: {
    marginTop: 22,

    flexDirection: "row",

    gap: 12,
  },

  field: {
    flex: 1,
  },

  label: {
    marginBottom: 7,

    fontSize: 10,
    fontWeight: "600",

    color: COLORS.textSecondary,
  },

  selector: {
    minHeight: 44,

    paddingHorizontal: 11,

    borderRadius: 10,

    borderWidth: 1,
    borderColor: COLORS.border,

    backgroundColor: COLORS.white,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  selectorText: {
    flex: 1,

    fontSize: 10.5,

    color: COLORS.black,
  },

  footer: {
    marginTop: 22,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    gap: 9,
  },

  cancelButton: {
    height: 38,

    paddingHorizontal: 15,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: COLORS.border,

    backgroundColor: COLORS.white,

    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 10,
    fontWeight: "600",

    color: COLORS.black,
  },

  printButton: {
    height: 38,

    paddingHorizontal: 15,

    borderRadius: 9,

    backgroundColor:
      COLORS.navigationActive,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,
  },

  printText: {
    fontSize: 10,
    fontWeight: "700",

    color: COLORS.white,
  },
});