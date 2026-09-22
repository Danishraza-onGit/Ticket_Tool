import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PendingRequestsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#3729AD"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Pending Requests
        </Text>

        <TouchableOpacity
          style={styles.headerUserBadge}
          onPress={() => router.push("/home/account")}
          activeOpacity={0.7}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerInitials}>
              SH
            </Text>
          </View>

          <Text style={styles.headerRole}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>
            Pending Requests
          </Text>

          <Text style={styles.subtitle}>
            Submissions from the public Request a Ticket form
            will appear here.
          </Text>
        </View>

        {/* Empty state */}
        <View style={styles.emptyCard}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="file-tray-outline"
              size={25}
              color="#3729AD"
            />
          </View>

          <Text style={styles.emptyTitle}>
            No pending requests
          </Text>

          <Text style={styles.emptyDescription}>
            New ticket requests will appear here when request
            data is connected through the API.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E7EF",

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#DCE4ED",

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    marginLeft: 12,

    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },

  headerUserBadge: {
    marginLeft: "auto",

    height: 32,
    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",

    paddingLeft: 4,
    paddingRight: 10,

    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  headerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,

    backgroundColor: "#000000",

    alignItems: "center",
    justifyContent: "center",
  },

  headerInitials: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerRole: {
    fontSize: 9,
    fontWeight: "600",
    color: "#2a2a2b",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  intro: {
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },

  subtitle: {
    marginTop: 5,

    fontSize: 11,
    lineHeight: 16,
    color: "#2a2a2b",
  },

  emptyCard: {
    minHeight: 220,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 13,

    paddingHorizontal: 28,

    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: "#F4F2FF",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },

  emptyDescription: {
    maxWidth: 280,

    marginTop: 6,

    textAlign: "center",

    fontSize: 10.5,
    lineHeight: 16,
    color: "#2a2a2b",
  },
});