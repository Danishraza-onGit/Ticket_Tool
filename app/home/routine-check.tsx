import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useRouter,
} from "expo-router";

import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import RoutineCheckCard from "../../components/routine-check/RoutineCheckCard";

import {
  temporaryRoutineChecks,
} from "../../data/routineCheck";

export default function RoutineCheckScreen() {
  const router = useRouter();

  const handleTicketPress = (
    ticketNo: string
  ) => {
    router.push({
      pathname: "/home/ticket-details",
      params: {
        ticketNo,
        source: "routine-check",
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="#2a2a2b"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Routine Checks
        </Text>

        <TouchableOpacity
          style={styles.headerUserBadge}
          onPress={() =>
            router.push("/home/account")
          }
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

      <FlatList
        data={temporaryRoutineChecks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.pageHeading}>
            <Text style={styles.title}>
              Routine Checks
            </Text>

            <Text style={styles.description}>
              Daily submission status for Team FMS&apos;s
              routine system-health checklist.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RoutineCheckCard
            record={item}
            onTicketPress={handleTicketPress}
          />
        )}
      />
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

    backgroundColor: "#2a2a2b",

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
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
  },

  pageHeading: {
    marginBottom: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#000000",
  },

  description: {
    marginTop: 5,

    maxWidth: 340,

    fontSize: 11,
    lineHeight: 16,
    color: "#2a2a2b",
  },
});