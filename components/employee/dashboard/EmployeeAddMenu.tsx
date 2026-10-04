import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";

type EmployeeAddMenuProps = {
  visible: boolean;
  onNewTicket: () => void;
  onClose: () => void;
};

export default function EmployeeAddMenu({
  visible,
  onNewTicket,
  onClose,
}: EmployeeAddMenuProps) {
  if (!visible) {
    return null;
  }

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
            pressed &&
              styles.menuItemPressed,
          ]}
          onPress={onNewTicket}
        >
          <Ionicons
            name="ticket-outline"
            size={17}
            color={COLORS.iconBlack}
          />

          <Text style={styles.menuText}>
            New Ticket
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

    width: 155,

    backgroundColor: COLORS.white,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
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
    minHeight: 43,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",
  },

  menuItemPressed: {
    backgroundColor: COLORS.background,
  },

  menuText: {
    marginLeft: 10,

    fontSize: 12,
    fontWeight: "500",

    color: COLORS.textPrimary,
  },
});