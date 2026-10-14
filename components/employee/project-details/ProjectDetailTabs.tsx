import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../../../constants/colors";

export type ProjectDetailTab =
  | "overview"
  | "audit";

type ProjectDetailTabsProps = {
  activeTab: ProjectDetailTab;

  onTabChange: (
    tab: ProjectDetailTab
  ) => void;
};

export default function ProjectDetailTabs({
  activeTab,
  onTabChange,
}: ProjectDetailTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "overview" &&
            styles.activeTab,
        ]}
        onPress={() =>
          onTabChange("overview")
        }
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "overview" &&
              styles.activeTabText,
          ]}
        >
          Overview
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "audit" &&
            styles.activeTab,
        ]}
        onPress={() =>
          onTabChange("audit")
        }
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "audit" &&
              styles.activeTabText,
          ]}
        >
          Audit Trail
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,

    marginTop: 16,

    padding: 4,

    borderRadius: 12,

    backgroundColor:
      COLORS.borderSoft,

    flexDirection: "row",
  },

  tab: {
    flex: 1,

    borderRadius: 9,

    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor:
      COLORS.white,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  tabText: {
    fontSize: 11,
    fontWeight: "500",

    color:
      COLORS.textSecondary,
  },

  activeTabText: {
    fontWeight: "600",

    color:
      COLORS.navigationActive,
  },
});