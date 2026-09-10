import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DashboardActionsMenuProps = {
  visible: boolean;
  onExport: () => void;
  onDownloadTemplate: () => void;
  onImport: () => void;
  onClose: () => void;
};

export default function DashboardActionsMenu({
  visible,
  onExport,
  onDownloadTemplate,
  onImport,
  onClose,
}: DashboardActionsMenuProps) {
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Invisible area used only for outside taps */}
      <Pressable
        style={styles.dismissArea}
        onPress={onClose}
      />

      {/* Actual menu */}
      <View style={styles.menu}>
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ]}
          onPress={onExport}
        >
          <Ionicons
            name="download-outline"
            size={17}
            color="#71849A"
          />

          <Text style={styles.menuText}>
            Export
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ]}
          onPress={onDownloadTemplate}
        >
          <Ionicons
            name="document-outline"
            size={17}
            color="#71849A"
          />

          <Text style={styles.menuText}>
            Download Template
          </Text>
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ]}
          onPress={onImport}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={17}
            color="#71849A"
          />

          <Text style={styles.menuText}>
            Import
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dismissArea: {
    position: "absolute",

    top: 0,
    left: -1000,
    right: -1000,
    bottom: -1000,

    backgroundColor: "transparent",

    zIndex: 1000,
  },

  menu: {
    position: "absolute",

    top: "100%",
    right: 0,

    marginTop: 5,

    width: 190,

    backgroundColor: "#FFFFFF",

    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#DCE4ED",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,

    elevation: 7,

    overflow: "hidden",

    zIndex: 1001,
  },

  menuItem: {
    minHeight: 42,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
  },

  menuItemPressed: {
    backgroundColor: "#F4F7FA",
  },

  menuText: {
    marginLeft: 10,

    fontSize: 12,
    fontWeight: "500",

    color: "#26364B",
  },

  separator: {
    height: 1,

    backgroundColor: "#EEF2F6",

    marginHorizontal: 10,
  },
});