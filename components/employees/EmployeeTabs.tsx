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
} from "../../types/employee";

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
              ? "#FFFFFF"
              : "#52647B"
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
              ? "#FFFFFF"
              : "#52647B"
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE4ED",
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
    backgroundColor: "#103A76",
  },

  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52647B",
  },

  activeTabText: {
    color: "#FFFFFF",
  },
});