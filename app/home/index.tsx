import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const menuItems = [
  "Dashboard",
  "My Tickets",
  "Projects",
  "More",
];

const moreItems = [
  "Overdue",
  "Inwards/Outwards",
  "Pending Requests",
  "Activity Log",
  "Customers",
  "Analytics",
  "Routine Check",
  "Employees",
];

const stats = [
  {
    title: "Total Tickets",
    value: "24",
  },
  {
    title: "Pending",
    value: "5",
  },
  {
    title: "In Process",
    value: "7",
  },
  {
    title: "Closed",
    value: "12",
  },
  {
    title: "Overdue",
    value: "2",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View 
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cygnus</Text>

        <View style={styles.userContainer}>
          <Text style={styles.userName}>Danish</Text>
          <Text style={styles.userRole}>Admin</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>Welcome back, Danish</Text>

        <Text style={styles.subtitle}>
          Here is an overview of your tickets.
        </Text>

        {/* Statistics */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.title} style={styles.statCard}>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setDrawerOpen(false)}
          />

          <View 
            style={[
              styles.drawer,
              Platform.OS === "ios" && {
                top: insets.top,
              },
            ]}
          >
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerLogo}>Cygnus</Text>

              <TouchableOpacity
                onPress={() => setDrawerOpen(false)}
              >
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Main Menu */}
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.menuItem}
                onPress={() => {
                  if (item === "More") {
                    setShowMore(!showMore);
                  }
                }}
              >
                <Text style={styles.menuItemText}>{item}</Text>

                {item === "More" && (
                  <Text style={styles.arrow}>
                    {showMore ? "▲" : "▼"}
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            {/* More Menu */}
            {showMore && (
              <View style={styles.moreContainer}>
                {moreItems.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.moreItem}
                    onPress={() => setDrawerOpen(false)}
                  >
                    <Text style={styles.moreItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  menuButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  menuIcon: {
    fontSize: 25,
    color: "#174F8A",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#174F8A",
    marginLeft: 8,
  },

  userContainer: {
    marginLeft: "auto",
    alignItems: "flex-end",
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  userRole: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 22,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },

  statTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#174F8A",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },

  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop:20,

    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 10,
  },

  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },

  drawerLogo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#174F8A",
  },

  closeButton: {
    fontSize: 32,
    color: "#6B7280",
  },

  menuItem: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },

  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
  },

  arrow: {
    fontSize: 12,
    color: "#6B7280",
  },

  moreContainer: {
    paddingLeft: 12,
    marginBottom: 8,
  },

  moreItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  moreItemText: {
    fontSize: 14,
    color: "#6B7280",
  },
});