import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  EmployeeManagementTab,
} from "../../../types/employee";
import { COLORS } from "@/constants/colors";

type EmployeeTabsProps = {
  activeTab: EmployeeManagementTab;
  onTabChange: (
    tab: EmployeeManagementTab
  ) => void;
};

export default function EmployeeTabs({
  activeTab,
  onTabChange,
}: EmployeeTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "employees" &&
            styles.activeTab,
        ]}
        onPress={() =>
          onTabChange("employees")
        }
        activeOpacity={0.8}
      >
        <Ionicons
          name="person-outline"
          size={15}
          color={
            activeTab === "employees"
              ? COLORS.white
              : COLORS.iconGrey
          }
        />

        <Text
          style={[
            styles.tabText,
            activeTab === "employees" &&
              styles.activeTabText,
          ]}
        >
          Employees
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "accountManagers" &&
            styles.activeTab,
        ]}
        onPress={() =>
          onTabChange("accountManagers")
        }
        activeOpacity={0.8}
      >
        <Ionicons
          name="briefcase-outline"
          size={15}
          color={
            activeTab === "accountManagers"
              ? COLORS.white
              : COLORS.iconGrey
          }
        />

        <Text
          style={[
            styles.tabText,
            activeTab === "accountManagers" &&
              styles.activeTabText,
          ]}
        >
          Account Managers
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  tab: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  activeTab: {
    backgroundColor: COLORS.navigationActive,
  },

  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textNeutral,
  },

  activeTabText: {
    color: COLORS.white,
  },
});