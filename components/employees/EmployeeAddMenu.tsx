import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type EmployeeAddMenuProps = {
  visible: boolean;
  onAddEmployee: () => void;
  onAddAccountManager: () => void;
  onClose: () => void;
};

export default function EmployeeAddMenu({
  visible,
  onAddEmployee,
  onAddAccountManager,
  onClose,
}: EmployeeAddMenuProps) {
  if (!visible) return null;

  return (
    <>
      <Pressable
        style={styles.dismissArea}
        onPress={onClose}
      />

      <View style={styles.menu}>
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ]}
          onPress={onAddEmployee}
        >
          <Ionicons
            name="person-add-outline"
            size={17}
            color="#71849A"
          />

          <Text style={styles.menuText}>
            New Employee
          </Text>
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ]}
          onPress={onAddAccountManager}
        >
          <Ionicons
            name="briefcase-outline"
            size={17}
            color="#71849A"
          />

          <Text style={styles.menuText}>
            Account Manager
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dismissArea: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 1000,
  },

  menu: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 6,
    width: 190,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE4ED",

    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
    zIndex: 1001,
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuItemPressed: {
    backgroundColor: "#F5F8FC",
  },

  menuText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#26364C",
  },

  separator: {
    height: 1,
    backgroundColor: "#EDF1F5",
  },
});