import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { AccountTab } from "../../types/account";

type AccountTabsProps = {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
};

export default function AccountTabs({
  activeTab,
  onTabChange,
}: AccountTabsProps) {
  return (
    <View style={styles.container}>
      <TabButton
        label="Profile"
        icon="person-outline"
        active={activeTab === "profile"}
        onPress={() => onTabChange("profile")}
      />

      <TabButton
        label="Password"
        icon="key"
        active={activeTab === "password"}
        onPress={() => onTabChange("password")}
      />

      <TabButton
        label="Settings"
        icon="settings"
        active={activeTab === "settings"}
        onPress={() => onTabChange("settings")}
      />
    </View>
  );
}

type TabButtonProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
};

function TabButton({
  label,
  icon,
  active,
  onPress,
}: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        active && styles.activeTab,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={15}
        color={active ? "#FFFFFF" : "#52647B"}
      />

      <Text
        style={[
          styles.tabText,
          active && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  tab: {
    flex: 1,
    height: 38,
    borderRadius: 10,
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
    fontWeight: "500",
    color: "#000000",
  },

  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});