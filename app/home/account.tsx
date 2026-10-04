import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  // Text,
  // TouchableOpacity,
  // View,
} from "react-native";

// import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountSummaryCard from "../../components/admin/account/AccountSummaryCard";
import AccountTabs from "../../components/admin/account/AccountTabs";
import ProfileSection from "../../components/admin/account/ProfileSection";
import PasswordSection from "../../components/admin/account/PasswordSection";
import SettingsSection from "../../components/admin/account/SettingsSection";
import SessionSecurityCard from "../../components/admin/account/SessionSecurityCard";
import BackHeader from "../../components/admin/navigation/BackHeader";

import type {
  AccountProfile,
  AccountTab,
} from "../../types/account";

const temporaryAdminProfile: AccountProfile = {
  username: "shazebk",
  displayName: "Shazeb Khan",
  email: "shazebk@cygnusanalytics.ai",
};

export default function AccountScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<AccountTab>("profile");

  const [notificationsEnabled] =
    useState(true);

  // const handleBack = () => {
  //   router.back();
  // };

  const handleNotificationsPress = () => {

    Alert.alert(
      "Push Notifications",
      notificationsEnabled
        ? "Push notifications are currently enabled."
        : "Push notifications are currently disabled."
    );
  };

  const handleLogout = () => {
  router.replace("/login");
};

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* ACCOUNT HEADER */}
      <BackHeader
        title="Account"
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* USER SUMMARY */}
          <AccountSummaryCard
            initials="SH"
            displayName={
              temporaryAdminProfile.displayName
            }
            email={temporaryAdminProfile.email}
            role="Admin"
          />

          {/* PROFILE / PASSWORD / SETTINGS */}
          <AccountTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* ACTIVE TAB */}
          {activeTab === "profile" && (
            <ProfileSection
              initialProfile={
                temporaryAdminProfile
              }
            />
          )}

          {activeTab === "password" && (
            <PasswordSection />
          )}

          {activeTab === "settings" && (
            <SettingsSection />
          )}

          {/* SESSION & SECURITY */}
          <SessionSecurityCard
            notificationsEnabled={
              notificationsEnabled
            }
            onNotificationsPress={
              handleNotificationsPress
            }
            onLogoutPress={handleLogout}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    color: "#16243A",
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
    backgroundColor: "#172238",
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
    color: "#52647B",
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
});