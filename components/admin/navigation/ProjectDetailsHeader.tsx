import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type ProjectDetailsHeaderProps = {
  onBackPress: () => void;
  onEditPress: () => void;
  onPrintPress: () => void;
};

export default function ProjectDetailsHeader({
  onBackPress,
  onEditPress,
  onPrintPress,
}: ProjectDetailsHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={COLORS.navigationActive}
        />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        Project Details
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEditPress}
          activeOpacity={0.7}
          accessibilityLabel="Edit project"
        >
          <Ionicons
            name="pencil-outline"
            size={18}
            color={COLORS.navigationActive}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPrintPress}
          activeOpacity={0.7}
          accessibilityLabel="Print project"
        >
          <Ionicons
            name="print-outline"
            size={18}
            color={COLORS.navigationActive}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 62,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
