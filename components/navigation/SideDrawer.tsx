import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

function MenuItem({
  icon,
  label,
  active = false,
  onPress,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        active && styles.activeMenuItem,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? "#174F8A" : "#536273"}
      />

      <Text
        style={[
          styles.menuText,
          active && styles.activeMenuText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function SideDrawer({
  visible,
  onClose,
}: SideDrawerProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.drawerContent}
        >
          {/* Header */}
          <View style={styles.drawerHeader}>
            <Text style={styles.logoText}>Cygnus</Text>
            <Text style={styles.subtitle}>
              Ticketing System
            </Text>
          </View>

          {/* Close */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={24}
              color="#536273"
            />
          </TouchableOpacity>

          {/* Add Ticket */}
          <TouchableOpacity
            style={styles.addTicketButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addTicketText}>
              Add New Ticket
            </Text>
          </TouchableOpacity>

          {/* Primary Navigation */}
          <View style={styles.navigationSection}>
            <MenuItem
              icon="grid-outline"
              label="Dashboard"
              active
              onPress={onClose}
            />

            <MenuItem
              icon="ticket-outline"
              label="My Tickets"
              onPress={onClose}
            />

            <MenuItem
              icon="warning-outline"
              label="Overdue"
              onPress={onClose}
            />

            <MenuItem
              icon="folder-outline"
              label="Projects"
              onPress={onClose}
            />
          </View>

          <View style={styles.divider} />

          {/* More */}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setMoreOpen(!moreOpen)}
            activeOpacity={0.7}
          >
            <View style={styles.moreLeft}>
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                size={20}
                color="#536273"
              />

              <Text style={styles.menuText}>
                More
              </Text>
            </View>

            <Ionicons
              name={
                moreOpen
                  ? "chevron-up-outline"
                  : "chevron-down-outline"
              }
              size={18}
              color="#536273"
            />
          </TouchableOpacity>

          {/* More Options */}
          {moreOpen && (
            <View style={styles.moreOptions}>
              <MenuItem
                icon="swap-horizontal-outline"
                label="Inwards/Outwards"
                onPress={onClose}
              />

              <MenuItem
                icon="time-outline"
                label="Pending Requests"
                onPress={onClose}
              />

              <MenuItem
                icon="list-outline"
                label="Activity Log"
                onPress={onClose}
              />

              <MenuItem
                icon="people-outline"
                label="Customers"
                onPress={onClose}
              />

              <MenuItem
                icon="analytics-outline"
                label="Analytics"
                onPress={onClose}
              />

              <MenuItem
                icon="checkmark-circle-outline"
                label="Routine Check"
                onPress={onClose}
              />

              <MenuItem
                icon="people-circle-outline"
                label="Employees"
                onPress={onClose}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Dark area outside drawer */}
      <TouchableOpacity
        style={styles.overlayTouchable}
        onPress={onClose}
        activeOpacity={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1000,
  },

  drawer: {
    width: "82%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    height: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  overlayTouchable: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  drawerContent: {
    padding: 24,
    paddingTop: 55,
  },

  drawerHeader: {
    marginBottom: 28,
  },

  logoText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#174F8A",
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 13,
    color: "#718096",
    marginTop: 3,
  },

  closeButton: {
    position: "absolute",
    right: 18,
    top: 50,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  addTicketButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#174F8A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  addTicketText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  navigationSection: {
    gap: 5,
  },

  menuItem: {
    height: 46,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  activeMenuItem: {
    backgroundColor: "#EAF2FA",
  },

  menuText: {
    fontSize: 14,
    color: "#536273",
    marginLeft: 13,
    fontWeight: "500",
  },

  activeMenuText: {
    color: "#174F8A",
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#E7EBEF",
    marginVertical: 18,
  },

  moreButton: {
    height: 46,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  moreLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  moreOptions: {
    marginTop: 4,
    marginLeft: 8,
  },
});