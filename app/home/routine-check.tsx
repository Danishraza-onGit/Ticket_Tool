import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  // TouchableOpacity,
  View,
} from "react-native";

// import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

import {
  useRouter,
} from "expo-router";

import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import RoutineCheckCard from "../../components/admin/routine-check/RoutineCheckCard";
import BackHeader from "../../components/admin/navigation/BackHeader";

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

      <BackHeader
  title="Routine Check"
  onBackPress={() => router.back()}
/>

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
    backgroundColor: COLORS.background,
  },

  header: {
    height: 60,
    backgroundColor: COLORS.white,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 11,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    marginLeft: 12,

    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  headerUserBadge: {
    marginLeft: "auto",

    height: 32,
    borderRadius: 16,

    borderWidth: 1,
    borderColor: COLORS.border,

    backgroundColor: COLORS.white,

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

    backgroundColor: COLORS.avatarBackground,

    alignItems: "center",
    justifyContent: "center",
  },

  headerInitials: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.white,
  },

  headerRole: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.danger,
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
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 5,

    maxWidth: 340,

    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textNeutral,
  },
});